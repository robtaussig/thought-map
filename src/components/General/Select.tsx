import React, { FC, ChangeEventHandler } from 'react';

interface SelectProps {
  id?: string,
  classes?: any,
  value: string,
  options: string[],
  onChange: ChangeEventHandler<HTMLSelectElement>,
  label?: string,
  injectedComponent?: any,
  title?: string,
  [rest: string]: any,
}

export const Select: FC<SelectProps> = React.memo(({ id, classes, value, options, onChange, label, injectedComponent, title, ...rest }) => {

  return (
    <label id={id} className={classes.selectLabel} title={title} {...rest}>
      <select className={classes.selectInput} onChange={onChange} value={value}>
        {options.map((option, idx) => {
          return <option key={`${idx}-option`} className={classes.option} value={option}>{option}</option>;
        })}
      </select>
      {label}
      {injectedComponent}
    </label>
  );
});

export default Select;
