import React from 'react';

export const CheckBox = React.memo(({ id, classes, isChecked, value, onChange, label, title }) => {

  return (
    <label id={id} title={title} className={classes.checkboxLabel}>
      <input type={'checkbox'} name={label} value={value} checked={isChecked} onChange={onChange}/>
      {label}
    </label>
  );
});

export default CheckBox;
