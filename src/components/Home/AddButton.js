import React, { useRef } from 'react';
import Add from '@material-ui/icons/Add';

export const AddButton = React.memo(({ classes, onClick, label, disabled }) => {
  const buttonRef = useRef(null);

  const handleMobileTouch = () => buttonRef.current.classList.add('touched');
  const handleMobileTouchEnd = () => {
    buttonRef.current.classList.remove('touched');
    onClick();
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
      <Add/>
    </button>
  );
});

export default AddButton;
