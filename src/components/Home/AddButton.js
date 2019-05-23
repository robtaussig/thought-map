import React, { useRef } from 'react';
import Add from '@material-ui/icons/Add';
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied';

export const AddButton = React.memo(({ classes, onClick, label, disabled }) => {
  const buttonRef = useRef(null);

  const handleMobileTouch = () => !disabled && buttonRef.current.classList.add('touched');
  const handleMobileTouchEnd = () => {
    if (!disabled) {
      buttonRef.current.classList.remove('touched');
      onClick();
    }
  };

  return (
    <button
      ref={buttonRef}
      className={classes.addButton}
      onTouchStart={handleMobileTouch}
      onTouchEnd={handleMobileTouchEnd}
      aria-label={label}
      disabled={disabled}
    >
      {disabled ? <SentimentDissatisfied/> : <Add/>}
    </button>
  );
});

export default AddButton;
