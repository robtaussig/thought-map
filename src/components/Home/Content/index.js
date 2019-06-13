import React, { useRef, useState, useEffect } from 'react';
import ThoughtNode from './ThoughtNode';

export const Content = React.memo(({ classes, thoughts, connections }) => {
  const [ thoughtPositions, setThoughtPositions ] = useState({});
  const rootRef = useRef(null);

  useEffect(() => {

    const thoughtPositions = thoughts.reduce((positions, thought) => {
      positions[thought.id] = { x: thought.id * 100, y: thought.id * 100 };
      return positions;
    }, {});

    setThoughtPositions(thoughtPositions);

  }, [thoughts, connections]);

  return (
    <div className={classes.content} ref={rootRef}>
      {thoughts.filter(thought => thought.status !== 'completed').map(thought => {
        return (
          <ThoughtNode
            classes={classes}
            key={`thought-node-${thought.id}`}  
            thought={thought}
            position={thoughtPositions[thought.id]}
          />
        );
      })}
    </div>
  );
});

export default Content;