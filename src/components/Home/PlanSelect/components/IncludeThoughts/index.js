import React from 'react';
import SelectableThought from './components/SelectableThought';

export const IncludeThoughts = ({ classes, thoughts, selected, onSelect, onRemove }) => {

  const handleSelect = id => () =>  onSelect(id);
  const handleRemove = id => () => onRemove(id);

  return (
    <div className={classes.includeThoughts}>
      <div className={classes.includeThoughtsColumnHeaders}><span>Not included</span><span>Included</span></div>
      <ul className={classes.selectableThoughts}>
        {thoughts
          .filter(thought => !thought.planId)
          .map(thought => {
            return (
              <SelectableThought
                key={`${thought.id}-selectable-thought`}
                classes={classes}
                thought={thought}
                isSelected={selected.includes(thought.id)}
                onSelect={handleSelect(thought.id)}
                onRemove={handleRemove(thought.id)}
              />
            );
          })}
      </ul>
    </div>
  );
};

export default IncludeThoughts;
