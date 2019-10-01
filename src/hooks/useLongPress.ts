import React, { useRef } from 'react';

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

export const useLongPress = (longPressCb: (e: any) => void, timer: number = 700) => {
  const pressTimeout = useRef<NodeJS.Timer>(null);

  const handlePressStart = (e: any) => {
    pressTimeout.current = setTimeout(() => {
      pressTimeout.current = null;
      if ('vibrate' in navigator) navigator.vibrate(100);
      longPressCb(e);
    }, timer);
  };

  const handlePressEnd = (e: any) => {
    if (pressTimeout.current) clearTimeout(pressTimeout.current);
  };

  if (isMobile) {
    return {
      onTouchStart: handlePressStart,
      onTouchEnd: handlePressEnd,
    };
  } else {
    return {
      onMouseDown: handlePressStart,
      onMouseUp: handlePressEnd,
    };
  }
};

export default useLongPress;
