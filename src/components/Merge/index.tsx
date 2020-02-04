import React, { FC, useState } from 'react';
import { useStyles } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { mergeResultsSelector, removeItem, resolveComparable } from '../../reducers/mergeResults';
import { thoughtSelector } from '../../reducers/thoughts';
import { planSelector } from '../../reducers/plans';
import CurrentCompare from './CurrentCompare';
import CompareQueue from './CompareQueue';
import CurrentReview from './CurrentReview';
import MergeStage from './MergeStage';
import { CurrentItem, Item } from './types';

export const Merge: FC = () => {
  const classes = useStyles({});
  const dispatch = useDispatch();
  const { itemsToAdd, comparables } = useSelector(mergeResultsSelector);
  const thoughts = useSelector(thoughtSelector);
  const plans = useSelector(planSelector);
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

  const handleRemoveReview = () => {
    dispatch(removeItem(currentItem.reviewIndex));
  };

  const handlePick = (item: Item) => {
    dispatch(resolveComparable({ comparableIndex: currentItem.compareIndex, item }));
  };

  const handleMerge = () => {
    console.log('merging');
  };

  return (
    <div className={classes.root}>
      {itemsToAdd[currentItem.reviewIndex] && (
        <CurrentReview
          classes={classes}
          thoughts={thoughts}
          item={itemsToAdd[currentItem.reviewIndex]}
          onRemove={handleRemoveReview}
        />
      )}
      {comparables[currentItem.compareIndex] && (
        <CurrentCompare
          rootClassName={classes.currentCompare}
          thoughts={thoughts}
          comparable={comparables[currentItem.compareIndex]}
          onPick={handlePick}
          plans={plans}
        />
      )}
      {comparables.length === 0 && (
        <button className={classes.readyToMergeButton} onClick={handleMerge}>
          Ready to merge!
        </button>
      )}
      <CompareQueue
        rootClassName={classes.compareQueue}
        comparables={comparables}
        currentItemIndex={currentItem.compareIndex}
        onClick={handleClickCompareQueue}
      />
      <MergeStage
        rootClassName={classes.mergeStage}
        itemsToAdd={itemsToAdd}
        currentItemIndex={currentItem.reviewIndex}
        onClick={handleClickMergeStage}
      />
    </div>
  );
};

export default Merge;
