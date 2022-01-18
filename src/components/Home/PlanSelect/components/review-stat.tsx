import React, { FC } from 'react';

interface ReviewStatProps {
  classes: any;
  field: string;
  value: string | number;
}

export const ReviewStat: FC<ReviewStatProps> = ({ classes, field, value }) => {

  return (
    <div className={classes.reviewStat}>
      <span className={classes.reviewStatField}>{field}:</span>
      <span className={classes.reviewStatValue}>{value}</span>
    </div>
  );
};

export default ReviewStat;
