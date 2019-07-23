import React from 'react';

export const PriorityThought = ({ classes, thought }) => {

  return (
    <React.Fragment>
      <span className={classes.thoughtTitle}>
        {thought.title}
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
