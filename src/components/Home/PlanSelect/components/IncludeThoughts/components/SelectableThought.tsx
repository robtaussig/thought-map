import React, { FC } from 'react';
import { Thought } from 'store/rxdb/schemas/thought';

interface SelectableThoughtProps {
  classes: any,
  thought: Thought,
  isSelected: Boolean,
  onSelect: () => void,
  onRemove: () => void,
}

export const SelectableThought: FC<SelectableThoughtProps> = ({ classes, thought, isSelected, onSelect, onRemove }) => {
  
  return (
    <li className={`${classes.selectableThought}${isSelected ? ' selected' :''}`}>
      <span className={classes.selectableThoughtTitle} onClick={isSelected ? onRemove : onSelect}>{thought.title}</span>
    </li>
  );
};

export default SelectableThought;
