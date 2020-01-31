import React, { FC, useState } from 'react';
import { useStyles } from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { mergeResultsSelector } from '../../reducers/mergeResults';
import { thoughtSelector } from '../../reducers/thoughts';
import CurrentCompare from './CurrentCompare';
import CompareQueue from './CompareQueue';
import CurrentReview from './CurrentReview';
import MergeStage from './MergeStage';
import { CurrentItem, Item } from './types';

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

  const handleRemoveReview = () => {
    console.log('remove');
  };

  const handlePick = (item: Item) => {
    console.log(item);
  };

  return (
    <div className={classes.root}>
      {currentItem.reviewIndex !== null && (
        <CurrentReview
          classes={classes}
          thoughts={thoughts}
          item={itemsToAdd[currentItem.reviewIndex]}
          onRemove={handleRemoveReview}
        />
      )}
      {currentItem.compareIndex !== null && (
        <CurrentCompare
          classes={classes}
          thoughts={thoughts}
          comparable={comparables[currentItem.compareIndex]}
          onPick={handlePick}
        />
      )}
      <CompareQueue
        classes={classes}
        comparables={comparables}
        currentItemIndex={currentItem.compareIndex}
        onClick={handleClickCompareQueue}
      />
      <MergeStage
        classes={classes}
        itemsToAdd={itemsToAdd}
        currentItemIndex={currentItem.reviewIndex}
        onClick={handleClickMergeStage}
      />
    </div>
  );
};

export default Merge;
