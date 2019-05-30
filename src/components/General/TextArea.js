import React from 'react';

export const TextArea = React.memo(({ id, classes, value, onChange, onFocus, label }) => {

  return (
    <label id={id} className={classes.textAreaLabel}>
      {label}
      <textarea className={classes.textAreaInput} value={value} onChange={onChange} onFocus={onFocus}/>
    </label>
  );
});

export default TextArea;
