import React from 'react';

export const PhaseDate = React.memo(({ id, classes, value, onChange, label }) => {

  return (
    <label id={id} className={classes.phaseDateLabel}>
      <input className={classes.phaseDateField} type={'date'} value={value} onChange={onChange}/>
      {label}
    </label>
  );
});

export default PhaseDate;
