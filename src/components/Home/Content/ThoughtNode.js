import React, { Fragment } from 'react';
import useApp from '../../../hooks/useApp'

export const ThoughtNode = React.memo(({ classes, thought, position = {} }) => {
  const { history, dispatch } = useApp();

  return (
    <Fragment>
      <span>{thought.title}</span>
      <span>{thought.description}</span>
      <span>{thought.type}</span>
      <span>{thought.status}</span>
    </Fragment>
  );
});

export default ThoughtNode;
