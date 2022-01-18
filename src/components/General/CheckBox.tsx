import React, { ChangeEvent, FC } from 'react';
import Tooltip from './Tooltip';

interface CheckBoxProps {
  id?: string;
  classes?: any;
  isChecked: boolean;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  title?: string;
  tooltip?: string;
  [rest: string]: any;
}

export const CheckBox: FC<CheckBoxProps> = React.memo(({ id, classes, isChecked, value, onChange, label, title, tooltip, ...rest }) => {

  return (
    <label id={id} title={title} className={classes.checkboxLabel} {...rest}>
      <input type={'checkbox'} name={label} value={value} checked={isChecked} onChange={onChange}/>
      {label}
      {tooltip && (
        <Tooltip text={tooltip}/>
      )}
    </label>
  );
});

export default CheckBox;
