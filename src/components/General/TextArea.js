import React from 'react';

export const TextArea = React.memo(({ id, classes, value, onChange, onFocus, label, ...rest }) => {

  return (
    <label id={id} className={classes.textAreaLabel} {...rest}>
      {label}
      <textarea className={classes.textAreaInput} value={value} onChange={onChange} onFocus={onFocus}/>
    </label>
  );
});

export default TextArea;
