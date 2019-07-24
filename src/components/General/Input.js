import React, { useEffect, useRef, useMemo } from 'react';

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
  placeholder,
  autoSuggest,
  onInputFocus,
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

  const handleClickSuggestion = suggestionValue => {
    if (suggestionValue.startsWith(' ')) {
      onChange({
        target: {
          value: `${value}${suggestionValue} `
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

  const _autoSuggestComponent = useMemo(() => {

    if (autoSuggest && autoSuggest.length > 0) {
      return (
        <ul style={{
          position: 'fixed',
          display: 'flex',
          bottom: '110px',
          left: '0px',
          right: '0px',
          height: '80px',
          backgroundColor: 'black',
          alignItems: 'center',
          justifyContent: 'space-around',
          opacity: 0.7,
          overflow: 'auto',
        }}>
          {autoSuggest.map((suggestion, idx) => {
            return (
              <li
                key={`${suggestion}-${idx}`}
                style={{
                  margin: '0 15px',
                }}
              >
                <button
                  style={{
                    color: 'white',
                  }}
                  onClick={() => {
                    handleClickSuggestion(suggestion);
                  }}
                >
                  {suggestion.replace(' ', '...')}
                </button>
              </li>
            )
          })}
        </ul>
      );
    }
    return null;
  }, [autoSuggest]);

  return (
    <label key={`${id}-label`} ref={rootRef} id={id} className={classes.inputLabel} onFocus={onInputFocus} onClick={focusOnLabelClick ? undefined : e => e.preventDefault()} {...rest}>
      <div>
        <input key={`${id}-input`} ref={inputRef} className={classes.inputField} placeholder={placeholder} type={'text'} value={value} onChange={onChange} autoFocus={autoFocus}/>
        <span/>
      </div>
      {label}
      {injectedComponent}
      {DeleteButton}
      {_autoSuggestComponent}
    </label>
  );
});

export default Input;
