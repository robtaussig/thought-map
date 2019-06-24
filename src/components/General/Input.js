import React, { useEffect, useRef } from 'react';

export const Input = React.memo(({
  classes,
  value,
  onChange,
  label,
  id,
  onFocus,
  DeleteButton,
  scrollToOnMount,
  autoFocus,
  injectedComponent,
  focusOnLabelClick = true,
  ...rest,
}) => {
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollToOnMount) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (onFocus) {
      const focus = () => inputRef.current.focus();
      onFocus(focus);
    }
  }, []);
  return (
    <label key={`${id}-label`} ref={rootRef} id={id} className={classes.inputLabel} onClick={focusOnLabelClick ? undefined : e => e.preventDefault()} {...rest}>
      <div>
        <input key={`${id}-input`} ref={inputRef} className={classes.inputField} type={'text'} value={value} onChange={onChange} autoFocus={autoFocus}/>
        <span/>
      </div>
      {label}
      {injectedComponent}
      {DeleteButton}
    </label>
  );
});

export default Input;
