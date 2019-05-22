import React, { useRef, useState, useEffect } from 'react';
import useApp from '../../../hooks/useApp'
import ThoughtNode from './ThoughtNode';
import Headers from './Headers';

export const Content = React.memo(({ classes, thoughts, connections }) => {
  const { history, dispatch } = useApp();
  const [ thoughtPositions, setThoughtPositions ] = useState({});
  const rootRef = useRef(null);

  useEffect(() => {

    const thoughtPositions = thoughts.reduce((positions, thought) => {
      positions[thought.id] = { x: thought.id * 100, y: thought.id * 100 };
      return positions;
    }, {});

    thoughtPositions.root = {
      display: 'grid',
      gridTemplateRows: `30px repeat(${thoughts.length}, 1fr)`,
      gridTemplateColumns: `repeat(4, 1fr)`,
    };

    setThoughtPositions(thoughtPositions);

  }, [thoughts, connections]);

  return (
    <div className={classes.content} ref={rootRef} style={thoughtPositions.root}>
      <Headers classes={classes}/>
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