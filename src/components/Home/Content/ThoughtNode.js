import React from 'react';
import useApp from '../../../hooks/useApp'

export const ThoughtNode = React.memo(({ classes, thought, position = {} }) => {
  const { history, dispatch } = useApp();

  return (
    <div className={classes.thoughtNode}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        height: 30,
        width: 30,
        backgroundColor: 'red',
        borderRadius: '50%',
      }}
    >

    </div>
  );
});

export default ThoughtNode;
