import React, { useRef, useState, useEffect } from 'react';
import useApp from '../../../hooks/useApp'
import ThoughtNode from './ThoughtNode';

export const Content = React.memo(({ classes, thoughts, connections }) => {
  const { history, dispatch } = useApp();
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
      {thoughts.map((thought, thoughtIdx) => {
        return (
          <ThoughtNode
            classes={classes}
            key={`${thoughtIdx}-thought-node`}  
            thought={thought}
            position={thoughtPositions[thought.id]}
          />
        );
      })}
    </div>
  );
});

export default Content;