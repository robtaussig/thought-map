import React from 'react';

export const SelectableThought = ({ classes, thought, isSelected, onSelect, onRemove }) => {
  
  return (
    <li className={`${classes.selectableThought}${isSelected ? ' selected' :''}`}>
      <span className={classes.selectableThoughtTitle} onClick={isSelected ? onRemove : onSelect}>{thought.title}</span>
    </li>
  );
};

export default SelectableThought;
