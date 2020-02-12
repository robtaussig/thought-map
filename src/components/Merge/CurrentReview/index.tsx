import React, { FC } from 'react';
import { useStyles } from './styles';
import { Thought as ThoughtType } from '../../../store/rxdb/schemas/thought';
import { Connection as ConnectionType } from '../../../store/rxdb/schemas/connection';
import { Plan as PlanType } from '../../../store/rxdb/schemas/plan';
import { Item } from '../types';
import Connection from './Connection';
import Thought from './Thought';
import Base from './Base';
import Plan from './Plan';
import ThoughtAssociation from './ThoughtAssociation';

interface CurrentReviewProps {
  item: Item;
  rootClassName: string;
  thoughts: ThoughtType[];
  plans: PlanType[];
  items: Item[];
}

export const CurrentReview: FC<CurrentReviewProps> = ({
  rootClassName,
  item,
  thoughts,
  plans,
  items,
}) => {
  const classes = useStyles({});

  switch (item.collectionName) {
    case 'connection':
      return (
        <Connection
          classes={classes}
          rootClassName={rootClassName}
          thoughts={thoughts}
          connection={item.item as ConnectionType}
          items={items}
        />
      );
    case 'plan':
      return (
        <Plan
          classes={classes}
          rootClassName={rootClassName}
          plan={item.item as PlanType}
        />
      );
    case 'thought':
      return (
        <Thought
          classes={classes}
          rootClassName={rootClassName}
          thought={item.item as ThoughtType}
          plans={plans}
          items={items}
        />
      );
    case 'custom_object':
      return (
        <Base
          classes={classes}
          rootClassName={rootClassName}
          header={'Custom Object'}
          subHeader={item.item.type}
          mainField={item.item.value}
          fields={item.item}
        />
      );
    default:
      return (
        <ThoughtAssociation
          classes={classes}
          rootClassName={rootClassName}
          thoughts={thoughts}
          item={item}
          items={items}
          plans={plans}
        />
      );
  }
};

export default CurrentReview;
