import React, { Fragment } from 'react';
import useApp from '../../../hooks/useApp'

export const ThoughtNode = React.memo(({ classes, thought, position = {} }) => {
  const { history, dispatch } = useApp();

  return (
    <div className={classes.thoughtNode}>
      <span>{thought.title}</span>
      <span>{thought.description}</span>
      <span>{thought.type}</span>
      <span>{thought.status}</span>
    </div>
  );
});

export default ThoughtNode;
