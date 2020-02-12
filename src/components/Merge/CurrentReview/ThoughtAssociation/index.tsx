import React, { FC } from 'react';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { Plan } from '../../../../store/rxdb/schemas/plan';
import { Item } from '../../types';
import Base from '../Base';

interface ThoughtAssociationProps {
  classes: any;
  rootClassName: string;
  thoughts: Thought[];
  plans: Plan[];
  item: Item;
  items: Item[];
}

const MOCK_THOUGHT = {
  title: 'Unkown Thought'
};

const MOCK_PLAN = {
  name: 'Unkown Plan',
};

export const ThoughtAssociation: FC<ThoughtAssociationProps> = ({
  classes,
  rootClassName,
  thoughts,
  item,
  plans,
  items,
}) => {

  const thought = thoughts.find(({ id }) => item.item.thoughtId === id) ||
    items.find(foundItem => foundItem.item.id === item.item.thoughtId)?.item ||
    MOCK_THOUGHT;

  const plan = plans.find(({ id }) => (thought as Thought).planId === id) ||
    items.find(foundItem => foundItem.item.id === (thought as Thought).planId)?.item ||
    MOCK_PLAN;
    
  const { id, updated, thoughtId, ...restOfItem } = item.item;
  
  return (
    <Base
      classes={classes}
      rootClassName={rootClassName}
      header={item.collectionName}
      subHeader={thought.title}
      mainField={plan.name}
      fields={restOfItem}
    />
  );
};

export default ThoughtAssociation;
