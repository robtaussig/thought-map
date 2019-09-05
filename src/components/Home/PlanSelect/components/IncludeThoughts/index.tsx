import React, { FC } from 'react';
import SelectableThought from './components/SelectableThought';
import { Thought } from '~store/rxdb/schemas/thought';

interface IncludeThoughtsProps {
  classes: any,
  thoughts: Thought[],
  selected: string[],
  onSelect: (id: string) => void,
  onRemove: (id: string) => void,
  onCancel: () => void,
}

export const IncludeThoughts: FC<IncludeThoughtsProps> = ({ classes, thoughts, selected, onSelect, onRemove, onCancel }) => {

  const handleSelect = (id: string) => () =>  onSelect(id);
  const handleRemove = (id: string) => () => onRemove(id);

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
      <button className={classes.cancelButton} onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default IncludeThoughts;
