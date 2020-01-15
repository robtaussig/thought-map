import { useRef } from 'react';

interface Handlers {
  onStart?: () => void;
  onEnd?: () => void;
  onCancel?: () => void;
  onClick?: () => void;
}

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

export const useLongPress = (longPressCb: (e: any) => void, timer: number = 400, combinedHandlers: Handlers = {}) => {
  const pressTimeout = useRef<NodeJS.Timer>(null);
  const didLongPress = useRef<boolean>(false);
  const isMoving = useRef<boolean>(false);
  const origin = useRef<{ x: number, y: number }>(null);

  const handlePressStart = (e: any) => {
    isMoving.current = false;
    if (isMobile) {
      const { clientX, clientY } = e.touches[0];
      origin.current = { x: clientX, y: clientY };
    }
    combinedHandlers.onStart && combinedHandlers.onStart();
    pressTimeout.current = setTimeout(() => {
      pressTimeout.current = null;
      origin.current = null;
      didLongPress.current = true;
      combinedHandlers.onCancel && combinedHandlers.onCancel();
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
      longPressCb(e);
    }, timer);
  };

  const handlePressEnd = (e: any) => {
    combinedHandlers.onEnd && combinedHandlers.onEnd();
    combinedHandlers.onClick && e.preventDefault();
    if (didLongPress.current === false && isMoving.current === false) {
      combinedHandlers.onClick && combinedHandlers.onClick();
    } else {
      didLongPress.current = false;
    }

    if (pressTimeout.current) clearTimeout(pressTimeout.current);
  };

  const handleTouchMove = (e: any) => {
    const { clientX, clientY } = e.touches[0];
    if (
      origin.current !== null && (Math.abs(clientX - origin.current.x) > 10 ||
        Math.abs(clientY - origin.current.y) > 10)
    ) {
      origin.current = null;
      isMoving.current = true;
      handlePressEnd(e);
    }
  }

  if (isMobile) {
    return {
      onTouchStart: handlePressStart,
      onTouchEnd: handlePressEnd,
      onTouchMove: handleTouchMove,
      onContextMenu: (e: any) => e.preventDefault(),
    };
  } else {
    return {
      onMouseDown: handlePressStart,
      onMouseUp: handlePressEnd,
    };
  }
};

export default useLongPress;
