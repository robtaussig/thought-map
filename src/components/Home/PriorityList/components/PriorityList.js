import React from 'react';
import PriorityThought from './PriorityThought';

export const PriorityList = ({ classes, thoughts }) => {

  return (
    <ul className={classes.priorityList}>
      {thoughts.map(thought => <PriorityThought classes={classes} key={thought.id} thought={thought}/>)}
    </ul>
  );
};

export default PriorityList;
