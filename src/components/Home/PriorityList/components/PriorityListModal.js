import React, { useMemo } from 'react';
import PriorityList from './PriorityList';
import { differenceInDays, differenceInHours } from 'date-fns';

export const PriorityListModal = ({ classes, thoughts, onClose }) => {
  const priorityThoughts = useMemo(() => {
    const thoughtsWithPriority = thoughts.map(assignThoughtPriority);

    return thoughtsWithPriority
      .sort((a, b) => a.priority > b.priority ? -1 : 1)
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
  if (!date) return 0;

  const daysDiff = differenceInDays(new Date(date), new Date());

  if (daysDiff < 0) return 10;
  if (daysDiff < 1) return 7;
  if (daysDiff < 3) return 5;
  if (daysDiff < 5) return 3;
  return 1;
};

const getPriorityModifier = ({ priority }) => {
  return priority || 0;
};

const getLastUpdatedModifier = ({ updated }) => {
  const hoursDiff = differenceInHours(new Date(), new Date(updated));

  if (hoursDiff < 1) return 3;
  if (hoursDiff < 24) return 2;
  if (hoursDiff < 48) return 1;
  return 0;
};

const getStatusModifier = ({ status }) => {

  return {
    'new': 1,
    'in progress': 2,
    'almost done': 3,
    'completed': -1000,
  }[status];
};

const getTypeModifier = ({ type }) => {

  return {
    'reminder': 3,
    'todo': 2,
    'task': 1,
    'misc': 0,
  }[type.toLowerCase()];
};

export default PriorityListModal;
