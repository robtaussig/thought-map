import React, { FC } from 'react';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { Item } from '../types';

interface CurrentReviewProps {
  classes: any;
  item: Item;
  onRemove: () => void;
  thoughts: Thought[];
}

export const CurrentReview: FC<CurrentReviewProps> = ({ classes, item, onRemove, thoughts }) => {

  return (
    <div className={classes.currentReview}>
      CurrentReview
    </div>
  );
};

export default CurrentReview;
