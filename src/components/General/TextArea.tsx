import React, { FC, ChangeEventHandler } from 'react';

interface TextAreaProps {
  id?: string,
  classes?: any,
  value: string,
  onChange: ChangeEventHandler<HTMLTextAreaElement>,
  onFocus?: ChangeEventHandler<HTMLTextAreaElement>,
  label?: string,
  [rest: string]: any,
}


export const TextArea: FC<TextAreaProps> = React.memo(({ id, classes, value, onChange, onFocus, label, ...rest }) => {

  return (
    <label id={id} className={classes.textAreaLabel} {...rest}>
      {label}
      <textarea className={classes.textAreaInput} value={value} onChange={onChange} onFocus={onFocus}/>
    </label>
  );
});

export default TextArea;
