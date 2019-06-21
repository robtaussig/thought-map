import React, { useRef } from 'react';
import Add from '@material-ui/icons/Add';
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied';

export const CircleButton = React.memo(({ classes, id = 'add-button', onClick, label, disabled, Icon = Add, title }) => {
  const buttonRef = useRef(null);
  const isCancelled = useRef(null);

  const handleInteractionStart = () => {
    isCancelled.current = false;
    !disabled && buttonRef.current.classList.add('touched');
  };
  const handleInteractionEnd = e => {
    buttonRef.current.classList.remove('touched');
    e.preventDefault();
    if (!disabled && isCancelled.current === false) {
      onClick();
    }
  };
  const handleCancelInteraction = e => {
    isCancelled.current = true;
    buttonRef.current.classList.remove('touched');
  };

  return (
    <button
      id={id}
      ref={buttonRef}
      title={title} 
      className={classes.circleButton}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onMouseMove={handleCancelInteraction}
      onTouchMove={handleCancelInteraction}
      aria-label={label}
      disabled={disabled}
    >
      {disabled ? <SentimentDissatisfied/> : <Icon/>}
    </button>
  );
});

export default CircleButton;
