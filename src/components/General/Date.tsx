import React, { FC, ChangeEventHandler } from 'react';

interface DateProps {
  id?: string,
  classes?: any,
  value: string | string[] | number,
  onChange: ChangeEventHandler,
  label?: string,
  time?: string,
  autoFocus?: boolean,
  [rest: string]: any,
}

export const Date: FC<DateProps> = React.memo(({ id, classes, value, onChange, label, time, autoFocus, ...rest }) => {

  return (
    <label id={id} className={classes.dateLabel} {...rest}>
      <input className={classes.dateField} type={time ? 'time' : 'date'} value={value} onChange={onChange} autoFocus={autoFocus}/>
      {label}
    </label>
  );
});

export default Date;
