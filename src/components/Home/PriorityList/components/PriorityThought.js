import React from 'react';
import useApp from '../../../../hooks/useApp'
import { homeUrl } from '../../../../lib/util';
import classNames from 'classnames';

export const PriorityThought = ({ classes, thought, onMinimize }) => {
  const { history, dispatch } = useApp();

  const handleClick = e => {
    history.push(`${homeUrl(history)}thought/${thought.id}`);
    onMinimize();
  };

  return (
    <React.Fragment>
      <span className={classNames(classes.thoughtTitle, {
        highPriority: thought.priority === 10,
      })}>
        <button className={classes.thoughtTitleButton} onClick={handleClick}>{thought.title}</button>
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
