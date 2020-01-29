import React, { useEffect, useRef, useMemo, FC, Fragment } from 'react';
import Tooltip from '../Tooltip';
import useAutoSuggest from 'react-use-autosuggest';
import AutoSuggestPortal from './auto-suggest-portal';

type Callback = (...params: any[]) => void;

interface ChangeTarget {
  value: string;
}

interface ChangeType {
  target: ChangeTarget;
}

export type InputChangeHandler = (e: ChangeType) => void;

interface InputProps {
  classes: any;
  value: string;
  onChange: InputChangeHandler;
  label?: string;
  id?: string;
  type?: string;
  setFocus?: (cb: Callback) => void;
  DeleteButton?: any;
  scrollToOnMount?: boolean;
  autoFocus?: boolean;
  injectedComponent?: any;
  focusOnLabelClick?: boolean;
  placeholder?: string;
  autoSuggest?: string[];
  tooltip?: string;
  password?: boolean;
  [rest: string]: any;
}

export const Input: FC<InputProps> = React.memo(({
  classes,
  value,
  onChange,
  label,
  id,
  setFocus,
  DeleteButton,
  scrollToOnMount,
  autoFocus,
  injectedComponent,
  focusOnLabelClick = true,
  placeholder,
  autoSuggest,
  tooltip,
  type,
  ...rest
}) => {
  const rootRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = autoSuggest ? useAutoSuggest(
    value, autoSuggest
  ) : [];
  
  useEffect(() => {
    if (scrollToOnMount) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (setFocus) {
      const focus = (shouldFocus: boolean = true) => shouldFocus ? inputRef.current.focus() : inputRef.current.blur();
      setFocus(focus);
    }
  }, []);

  const handleClickSuggestion = (suggestionValue: string): void => {
    if (suggestionValue.startsWith(' ')) {
      onChange({
        target: {
          value: `${value.trim()}${suggestionValue} `
        }
      })
    } else {
      onChange({
        target: {
          value: value.split(' ').map((word, idx) => {
            if (idx === value.split(' ').length - 1) {
              return suggestionValue;
            } else {
              return word;
            }
          }).join(' ') + ' '
        }
      })
    }
    inputRef.current.focus();
  };

  return (
    <Fragment>
      <label key={`${id}-label`} ref={rootRef} id={id} className={classes.inputLabel} onClick={focusOnLabelClick ? undefined : e => e.preventDefault()} {...rest}>
        <input
          key={`${id}-input`}
          ref={inputRef}
          className={classes.inputField}
          placeholder={placeholder}
          type={type || 'text'}
          autoComplete={type === 'password' ? 'current-password' : 'off'}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
        />
        {label}
        {injectedComponent}
        {DeleteButton}
        {tooltip && (
          <Tooltip text={tooltip}/>
        )}
      </label>
      {suggestions && suggestions.length > 0 && (
        <AutoSuggestPortal
          suggestions={suggestions}
          onClickSuggestion={handleClickSuggestion}
        />
      )}
    </Fragment>
  );
});

export default Input;
