import React, { FC, useState } from 'react';
import { useStyles } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { mergeResultsSelector } from '../../reducers/mergeResults';
import { thoughtSelector } from '../../reducers/thoughts';
import CurrentCompare from './CurrentCompare';
import CompareQueue from './CompareQueue';
import CurrentReview from './CurrentReview';
import MergeStage from './MergeStage';
import { CurrentItem } from './types';

export const Merge: FC = () => {
  const classes = useStyles({});
  const { itemsToAdd, comparables } = useSelector(mergeResultsSelector);
  const thoughts = useSelector(thoughtSelector);
  const [currentItem, setCurrentItem] = useState<CurrentItem>({
    compareIndex: 0,
    reviewIndex: null,
  });

  const handleClickCompareQueue = (index: number) => {
    setCurrentItem({
      compareIndex: index,
      reviewIndex: null,
    });
  };

  const handleClickMergeStage = (index: number) => {
    setCurrentItem({
      compareIndex: null,
      reviewIndex: index,
    });
  };

  return (
    <div className={classes.root}>
      {currentItem.reviewIndex !== null && <CurrentReview classes={classes} item={itemsToAdd[currentItem.reviewIndex]} />}
      {currentItem.compareIndex !== null && <CurrentCompare classes={classes} comparable={comparables[currentItem.compareIndex]} />}
      <CompareQueue classes={classes} comparables={comparables} onClick={handleClickCompareQueue} />
      <MergeStage classes={classes} itemsToAdd={itemsToAdd} onClick={handleClickMergeStage} />
    </div>
  );
};

export default Merge;
