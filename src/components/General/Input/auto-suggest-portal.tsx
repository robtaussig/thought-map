import React, { FC } from 'react';
import usePortal from '../../../hooks/usePortal';

interface AutoSuggestPortalProps {
  suggestions: string[],
  onClickSuggestion: (value: string) => void;
}

export const AutoSuggestPortal: FC<AutoSuggestPortalProps> = ({ suggestions, onClickSuggestion }) => {
  const Portal = usePortal();

  return (
    <Portal>
      <div className={'suggestions'} style={{
        display: 'flex',
        overflow: 'auto',
        justifyContent: 'space-between',
        padding: '20px 0',
      }}>
        {suggestions.map(suggestion => {
          return (
            <button
              key={suggestion}
              style={{
                margin: '0 10px',
              }}
              onClick={() => onClickSuggestion(suggestion)}>
                {suggestion}
              </button>
          );
        })}
      </div>
    </Portal>
  );
};

export default AutoSuggestPortal;
