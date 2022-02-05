import './style.scss';
import { CSSProperties, MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react';

type SetLoading = (text?: string) => void;
type StopLoading = () => void;
type UpdateText = (text: string) => void;

export const useLoadingOverlay = (containerRef: MutableRefObject<HTMLDivElement>): [SetLoading, StopLoading, UpdateText] => {
  const textNode = useRef<any>(null);
  const wakeLock = useRef<WakeLockSentinel>(null);

  const loadingOverlayElement = useMemo(() => {
    const loadingOverlay = document.createElement('div');
    Object.entries(loadingOverlayInlineStyle).forEach(([key, value]: [string, any]) => {
      loadingOverlay.style[(key as any)] = value;
    });
    const loader = document.createElement('div');
    loader.classList.add('loader');
    const outer = document.createElement('div');
    outer.classList.add('outer');
    const middle = document.createElement('div');
    middle.classList.add('middle');
    const inner = document.createElement('div');
    inner.classList.add('inner');

    loader.appendChild(outer);
    loader.appendChild(middle);
    loader.appendChild(inner);
    loadingOverlay.appendChild(loader);

    return loadingOverlay;
  }, []);

  const setLoading: SetLoading = useCallback(async string => {
    if (string && !textNode.current) {
      textNode.current = document.createElement('span');
      textNode.current.innerText = string;
      Object.entries(textNodeInlineStyle).forEach(([key, value]: [string, any]) => {
        textNode.current.style[(key as any)] = value;
      });

      loadingOverlayElement.appendChild(textNode.current);
    }
    containerRef.current.appendChild((loadingOverlayElement));
    if ('wakeLock' in navigator) {
      try {
        wakeLock.current?.release();
        wakeLock.current = await navigator.wakeLock.request('screen');
      } catch (e) {
        wakeLock.current = null;
      }
    }
  }, []);

  const stopLoading: StopLoading = useCallback(() => {
    if (textNode.current) {
      loadingOverlayElement.removeChild(textNode.current);
      textNode.current = null;
    }
    containerRef.current.removeChild((loadingOverlayElement));

    wakeLock.current?.release()
      .then(() => wakeLock.current = null);
  }, []);

  const updateText = useCallback((text: string) => {
    if (textNode.current) {
      textNode.current.remove();
    }
    textNode.current = document.createElement('span');
    textNode.current.innerText = text;
    Object.entries(textNodeInlineStyle).forEach(([key, value]: [string, any]) => {
      textNode.current.style[(key as any)] = value;
    });

    loadingOverlayElement.appendChild(textNode.current);
  }, []);

  useEffect(() => () => {
    wakeLock.current?.release();
  }, []);

  return [setLoading, stopLoading, updateText];
};

const textNodeInlineStyle: CSSProperties = {
  top: 'calc(50% + 40px)',
  position: 'absolute',
  textShadow: '1px 1px 4px #000000',
  color: 'white',
  fontWeight: 600,
  textAlign: 'center',
};

const loadingOverlayInlineStyle: CSSProperties = {
  position: 'absolute',
  left: '0',
  right: '0',
  top: '0',
  bottom: '0',
  backgroundColor: 'gray',
  opacity: 0.9,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 999999999,
};
