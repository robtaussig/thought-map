import React from 'react';

export const Date = React.memo(({ id, classes, value, onChange, label, time }) => {

  return (
    <label id={id} className={classes.dateLabel}>
      <input className={classes.dateField} type={time ? 'time' : 'date'} value={value} onChange={onChange}/>
      {label}
    </label>
  );
});

export default Date;