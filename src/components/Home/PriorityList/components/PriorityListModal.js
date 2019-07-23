import React, { useMemo } from 'react';
import PriorityList from './PriorityList';

export const PriorityListModal = ({ classes, thoughts, onClose }) => {
  const priorityThoughts = useMemo(() => {
    const thoughtsWithPriority = thoughts.map(assignThoughtPriority);

    return thoughtsWithPriority
      .sort((a, b) => a.priority > b.priority ? 1 : -1)
      .slice(0, 10)
      .map(({ thought }) => thought);
  }, [thoughts]);

  return (
    <div className={classes.root}>
      <h1 className={classes.header}>Priorities</h1>
      {priorityThoughts.length > 0 ?
        (<PriorityList classes={classes} thoughts={priorityThoughts}/>) :
        (<span>
          You are all caught up on priorities. Congratulations!
        </span>)
      }
    </div>
  );
};

const assignThoughtPriority = thought => {
  const dateModifier = getDateModifier(thought);
  const priorityModifier = getPriorityModifier(thought);
  const lastUpdatedModifier = getLastUpdatedModifier(thought);
  const statusModifier = getStatusModifier(thought);
  const typeModifier = getTypeModifier(thought);

  return {
    priority: dateModifier + priorityModifier + lastUpdatedModifier + statusModifier + typeModifier,
    thought,
  };
};

const getDateModifier = ({ date, time }) => {

  return 0;
};

const getPriorityModifier = ({ priority }) => {

  return 0;
};

const getLastUpdatedModifier = ({ updated }) => {

  return 0;
};

const getStatusModifier = ({ status }) => {

  return 0;
};

const getTypeModifier = ({ type }) => {

  return 0;
};

export default PriorityListModal;
