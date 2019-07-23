import React from 'react';
import PriorityThought from './PriorityThought';
import PriorityFields from './PriorityFields';

export const PriorityList = ({ classes, thoughts }) => {

  return (
    <div className={classes.priorityList}>
      <PriorityFields classes={classes}/>
      {thoughts.map(thought => <PriorityThought classes={classes} key={thought.id} thought={thought}/>)}
    </div>
  );
};

export default PriorityList;
