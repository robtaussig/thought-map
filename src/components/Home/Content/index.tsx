import React, { useRef, useState, useEffect, FC } from 'react';
import ThoughtNode from './ThoughtNode';
import { Plan } from '~store/rxdb/schemas/plan';
import { Thought } from '~store/rxdb/schemas/thought';
import { Connection } from '~store/rxdb/schemas/connection';

interface ContentProps {
  classes: any,
  thoughts: Thought[],
  plan: Plan,
}

export const Content: FC<ContentProps> = React.memo(({ classes, thoughts, plan }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div className={classes.content} ref={rootRef}>
      {thoughts.filter(thought => (plan && plan.showCompleted) || thought.status !== 'completed').map(thought => {
        return (
          <ThoughtNode
            classes={classes}
            key={`thought-node-${thought.id}`}  
            thought={thought}
          />
        );
      })}
    </div>
  );
});

export default Content;
