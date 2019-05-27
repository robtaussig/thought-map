import React, { useEffect, useRef } from 'react';

export const PhaseInput = React.memo(({ classes, value, onChange, label, id, autoFocus, DeleteButton, scrollToOnMount }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    if (scrollToOnMount) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  return (
    <label ref={rootRef} id={id} className={classes.phaseInputLabel}>
      <div>
        <input className={classes.phaseInputField} type={'text'} value={value} onChange={onChange} autoFocus={autoFocus}/>
        <span/>
      </div>
      {label}
      {DeleteButton}
    </label>
  );
});

export default PhaseInput;
