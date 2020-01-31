import React, { FC } from 'react';

interface CurrentReviewProps {
  classes: any;
}

export const CurrentReview: FC<CurrentReviewProps> = ({ classes }) => {

  return (
    <div className={classes.currentReview}>
      CurrentReview
    </div>
  );
};

export default CurrentReview;
