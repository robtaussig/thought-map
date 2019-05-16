import React, { useRef } from 'react';
import useApp from '../../hooks/useApp';
import Add from '@material-ui/icons/Add';

export const AddButton = React.memo(({ classes }) => {
  const { history, dispatch } = useApp();
  const buttonRef = useRef(null);

  const handleMobileTouch = () => buttonRef.current.classList.add('touched');
  const handleMobileTouchEnd = () => buttonRef.current.classList.remove('touched');

  return (
    <button
      ref={buttonRef}
      className={classes.addButton}
      onTouchStart={handleMobileTouch}
      onTouchEnd={handleMobileTouchEnd}
      aria-label={'Add Thought'}
    >
      <Add/>
    </button>
  );
});

export default AddButton;
