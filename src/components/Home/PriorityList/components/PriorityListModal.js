import React, { useMemo } from 'react';
import PriorityList from './PriorityList';

export const PriorityListModal = ({ classes, thoughts, onClose }) => {
  const priorityThoughts = useMemo(() => {
    const thoughtsWithPriority = thoughts.map(assignThoughtPriority);

    return thoughtsWithPriority
      .filter(({ priority }) => priority > 5)
      .sort((a, b) => a.priority > b.priority ? 1 : -1)
      .map(({ thought }) => thought);
  }, [thoughts]);

  return (
    <div className={classes.root}>
      <h1>Priorities</h1>
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

  return {
    priority: 6,
    thought,
  };
};

export default PriorityListModal;
