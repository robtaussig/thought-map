import React, { FC, ChangeEvent } from 'react';
import Tooltip from './Tooltip';

interface SelectProps {
  id?: string;
  classes?: any;
  value: string;
  options: string[];
  onChange: (event: ChangeEvent<HTMLSelectElement>, idx: number) => void;
  label?: string;
  injectedComponent?: any;
  title?: string;
  ariaLabel?: string;
  tooltip?: string;
  [rest: string]: any;
}

export const Select: FC<SelectProps> = React.memo(({
  id,
  classes,
  value,
  options,
  onChange,
  label,
  injectedComponent,
  title,
  ariaLabel,
  tooltip,
  ...rest
}) => {

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...e,
      target: {...e.target, value: options[e.target.value as any]},
    }, Number(e.target.value));
  }

  return (
    <label id={id} className={classes.selectLabel} title={title} {...rest}>
      <select className={classes.selectInput} onChange={handleChange} value={value} aria-label={ariaLabel || label}>
        {options.map((option, idx) => {
          return <option key={`${idx}-option`} className={classes.option} value={idx}>{option}</option>;
        })}
      </select>
      {label}
      {injectedComponent}
      {tooltip && (
        <Tooltip text={tooltip}/>
      )}
    </label>
  );
});

export default Select;
