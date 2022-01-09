import React, { FC } from 'react';
import { homeUrl } from '../../../../lib/util';
import classNames from 'classnames';
import { Thought } from 'store/rxdb/schemas/thought';
import { useNavigate } from 'react-router-dom';

interface PriorityThoughtProps {
  classes: any;
  thought: Thought;
  onMinimize: () => void;
}

export const PriorityThought: FC<PriorityThoughtProps> = ({ classes, thought, onMinimize }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${homeUrl()}thought/${thought.id}`);
    onMinimize();
  };

  return (
    <React.Fragment>
      <span className={classNames(classes.thoughtTitle, {
        highPriority: thought.priority > 7,
      })}>
        <button className={classes.thoughtTitleButton} onClick={handleClick}>{thought.title}</button>
      </span>
      <span className={classes.thoughtDate}>
        {thought.date}
      </span>
    </React.Fragment>
  );
};

export default PriorityThought;
