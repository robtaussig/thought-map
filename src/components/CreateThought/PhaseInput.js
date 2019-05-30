import React, { useEffect, useRef } from 'react';

export const PhaseInput = React.memo(({ classes, value, onChange, label, id, onFocus, DeleteButton, scrollToOnMount }) => {
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollToOnMount) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (onFocus) {
      const focus = () => inputRef.current.focus();
      onFocus(focus);
    }
  }, []);
  return (
    <label key={`${id}-label`} ref={rootRef} id={id} className={classes.phaseInputLabel}>
      <div>
        <input key={`${id}-input`} ref={inputRef} className={classes.phaseInputField} type={'text'} value={value} onChange={onChange}/>
        <span/>
      </div>
      {label}
      {DeleteButton}
    </label>
  );
});

export default PhaseInput;
