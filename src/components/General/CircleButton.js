import React, { useRef } from 'react';
import Add from '@material-ui/icons/Add';
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied';

export const CircleButton = React.memo(({ classes, id = 'add-button', onClick, label, disabled, Icon = Add }) => {
  const buttonRef = useRef(null);
  const isCancelled = useRef(null);

  const handleMobileTouch = () => {
    isCancelled.current = false;
    !disabled && buttonRef.current.classList.add('touched');
  };
  const handleMobileTouchEnd = e => {
    buttonRef.current.classList.remove('touched');
    e.preventDefault();
    if (!disabled && isCancelled.current === false) {
      onClick();
    }
  };

  return (
    <button
      id={id}
      ref={buttonRef}
      className={classes.circleButton}
      onTouchStart={handleMobileTouch}
      onTouchEnd={handleMobileTouchEnd}
      onMouseDown={handleMobileTouch}
      onMouseUp={handleMobileTouchEnd}
      onMouseMove={e => isCancelled.current = true}
      onTouchMove={e => isCancelled.current = true}
      aria-label={label}
      disabled={disabled}
    >
      {disabled ? <SentimentDissatisfied/> : <Icon/>}
    </button>
  );
});

export default CircleButton;
