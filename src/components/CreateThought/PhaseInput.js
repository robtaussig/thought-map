import React from 'react';

export const PhaseInput = React.memo(({ classes, value, onChange, label, id, autoFocus }) => {

  return (
    <label id={id} className={classes.phaseInputLabel}>
      <div>
        <input className={classes.phaseInputField} type={'text'} value={value} onChange={onChange} autoFocus={autoFocus}/>
        <span/>
      </div>
      {label}
    </label>
  );
});

export default PhaseInput;
