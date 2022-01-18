import React, { FC } from 'react';
import { Thought as ThoughtType } from '../../../../store/rxdb/schemas/thought';
import { Plan } from '../../../../store/rxdb/schemas/plan';
import { Item } from '../../types';
import Base from '../Base';

interface ThoughtProps {
  classes: any;
  thought: ThoughtType;
  rootClassName: string;
  plans: Plan[];
  items: Item[];
}

const MOCK_PLAN = {
  name: 'Unknown Plan',
};

export const Thought: FC<ThoughtProps> = ({
  classes,
  rootClassName,
  thought,
  plans,
  items,
}) => {
  const plan = plans.find(({ id }) => id === thought.planId) ||
    items.find(({ item }) => item.id === thought.planId)?.item ||
    MOCK_PLAN;

  const { title, id, planId, updated, ...restOfThought } = thought;

  return (
    <Base
      classes={classes}
      rootClassName={rootClassName}
      header={'Thought'}
      subHeader={thought.title}
      mainField={plan.name}
      fields={restOfThought}
    />
  );
};

export default Thought;
