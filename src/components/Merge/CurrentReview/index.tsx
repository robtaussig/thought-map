import React, { FC } from 'react';
import { Item } from '../types';

interface CurrentReviewProps {
  classes: any;
  item: Item;
}

export const CurrentReview: FC<CurrentReviewProps> = ({ classes, item }) => {

  return (
    <div className={classes.currentReview}>
      CurrentReview
    </div>
  );
};

export default CurrentReview;
