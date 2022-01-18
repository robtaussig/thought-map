import React, { ChangeEventHandler, FC } from 'react';
import Tooltip from './Tooltip';

interface RangeProps {
  id?: string;
  classes?: any;
  value: number;
  min: number;
  max: number;
  name: string;
  onChange: ChangeEventHandler;
  label?: string;
  autoFocus?: boolean;
  tooltip?: string;
  [rest: string]: any;
}

export const Range: FC<RangeProps> = React.memo(({ id, classes, value, name, min, max, onChange, label, autoFocus, tooltip, ...rest }) => {

  return (
    <label id={id} className={classes.rangeLabel} {...rest}>
      <input className={classes.rangeField} type={'range'} name={name} value={value} onChange={onChange} min={min} max={max} autoFocus={autoFocus}/>
      {label}
      {tooltip && (
        <Tooltip text={tooltip}/>
      )}
    </label>
  );
});

export default Range;
