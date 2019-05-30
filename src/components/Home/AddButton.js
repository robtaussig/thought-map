import React, { useRef } from 'react';
import Add from '@material-ui/icons/Add';
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied';

export const AddButton = React.memo(({ classes, id = 'add-button', onClick, label, disabled, Icon = Add }) => {
  const buttonRef = useRef(null);

  const handleMobileTouch = () => !disabled && buttonRef.current.classList.add('touched');
  const handleMobileTouchEnd = e => {
    if (!disabled) {
      buttonRef.current.classList.remove('touched');
      onClick();
      e.preventDefault();
    }
  };

  return (
    <button
      id={id}
      ref={buttonRef}
      className={classes.addButton}
      onTouchStart={handleMobileTouch}
      onTouchEnd={handleMobileTouchEnd}
      aria-label={label}
      disabled={disabled}
    >
      {disabled ? <SentimentDissatisfied/> : <Icon/>}
    </button>
  );
});

export default AddButton;
