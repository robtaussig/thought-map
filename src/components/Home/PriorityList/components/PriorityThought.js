import React from 'react';
import useApp from '../../../../hooks/useApp'
import { homeUrl } from '../../../../lib/util';

export const PriorityThought = ({ classes, thought, onMinimize }) => {
  const { history, dispatch } = useApp();

  const handleClick = e => {
    history.push(`${homeUrl(history)}thought/${thought.id}`);
    onMinimize();
  };

  return (
    <React.Fragment>
      <span className={classes.thoughtTitle}>
        <button onClick={handleClick}>{thought.title}</button>
      </span>
      <span className={classes.thoughtDate}>
        {thought.date}
      </span>
      <span className={classes.thoughtStatus}>
        {thought.status}
      </span>
    </React.Fragment>
  );
};

export default PriorityThought;
