import React from 'react';

export const PhaseSelect = React.memo(({ id, classes, value, options, onChange, label }) => {

  return (
    <label id={id} className={classes.phaseSelectLabel}>
      <select className={classes.phaseSelect} onChange={onChange} value={value}>
        {options.map((option, idx) => {
          return <option key={`${idx}-option`} className={classes.phaseOption} value={option}>{option}</option>;
        })}
      </select>
      {label}
    </label>
  );
});

export default PhaseSelect;
