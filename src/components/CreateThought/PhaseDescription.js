import React from 'react';

export const PhaseDescription = React.memo(({ id, classes, value, onChange, onFocus, label }) => {

  return (
    <label id={id} className={classes.phaseDescriptionLabel}>
      {label}
      <textarea className={classes.phaseDescriptionField} value={value} onChange={onChange} onFocus={onFocus}/>
    </label>
  );
});

export default PhaseDescription;
