import { useRef } from 'react';

interface Handlers {
  onStart?: (e: any) => void;
  onEnd?: (e: any) => void;
  onCancel?: (e: any) => void;
}

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

export const useLongPress = (longPressCb: (e: any) => void, timer: number = 500, combinedHandlers: Handlers = {}) => {
  const pressTimeout = useRef<NodeJS.Timer>(null);

  const handlePressStart = (e: any) => {
    combinedHandlers.onStart && combinedHandlers.onStart(e);
    pressTimeout.current = setTimeout(() => {
      pressTimeout.current = null;
      combinedHandlers.onCancel && combinedHandlers.onCancel(e);
      navigator.vibrate(100);
      longPressCb(e);
    }, timer);
  };

  const handlePressEnd = (e: any) => {
    combinedHandlers.onEnd && combinedHandlers.onEnd(e);
    if (pressTimeout.current) clearTimeout(pressTimeout.current);
  };

  if (isMobile) {
    return {
      onTouchStart: handlePressStart,
      onTouchEnd: handlePressEnd,
      onTouchMove: handlePressEnd,
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
