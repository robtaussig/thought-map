import React from 'react';

export const PriorityThought = ({ classes, thought }) => {

  return (
    <li className={classes.priorityThought}>
      {thought.title}
    </li>
  );
};

export default PriorityThought;
