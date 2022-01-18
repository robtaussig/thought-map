import React, { FC } from 'react';
import PriorityThought from './PriorityThought';
import PriorityFields from './PriorityFields';
import { Thought } from 'store/rxdb/schemas/thought';

interface PriorityListProps {
  classes: any;
  thoughts: Thought[];
  onMinimize: () => void;
}

export const PriorityList: FC<PriorityListProps> = ({ classes, thoughts, onMinimize }) => {

  return (
    <div className={classes.priorityList}>
      <PriorityFields classes={classes}/>
      {thoughts.map(thought => <PriorityThought classes={classes} key={thought.id} thought={thought} onMinimize={onMinimize}/>)}
    </div>
  );
};

export default PriorityList;
