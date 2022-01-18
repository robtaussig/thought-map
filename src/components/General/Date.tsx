import React, { ChangeEventHandler, FC } from 'react';
import Tooltip from './Tooltip';

interface DateProps {
  id?: string;
  classes?: any;
  value: string | string[] | number;
  onChange: ChangeEventHandler;
  label?: string;
  time?: boolean;
  autoFocus?: boolean;
  tooltip?: string;
  [rest: string]: any;
}

export const Date: FC<DateProps> = React.memo(({ id, classes, value, onChange, label, time, autoFocus, tooltip, ...rest }) => {

  return (
    <label id={id} className={classes.dateLabel} {...rest}>
      <input className={classes.dateField} type={time ? 'time' : 'date'} value={value} onChange={onChange} autoFocus={autoFocus}/>
      {label}
      {tooltip && (
        <Tooltip text={tooltip}/>
      )}
    </label>
  );
});

export default Date;
