import React, { FC } from 'react';
import useApp from '../../../../hooks/useApp'
import { homeUrl } from '../../../../lib/util';
import classNames from 'classnames';
import { Thought } from 'store/rxdb/schemas/thought';

interface PriorityThoughtProps {
  classes: any,
  thought: Thought,
  onMinimize: () => void,
}

export const PriorityThought: FC<PriorityThoughtProps> = ({ classes, thought, onMinimize }) => {
  const { history } = useApp();

  const handleClick = () => {
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
