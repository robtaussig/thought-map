import React from 'react';
import PriorityThought from './PriorityThought';
import PriorityFields from './PriorityFields';

export const PriorityList = ({ classes, thoughts, onMinimize }) => {

  return (
    <div className={classes.priorityList}>
      <PriorityFields classes={classes}/>
      {thoughts.map(thought => <PriorityThought classes={classes} key={thought.id} thought={thought} onMinimize={onMinimize}/>)}
    </div>
  );
};

export default PriorityList;
