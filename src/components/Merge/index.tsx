import React, { FC, useState, useMemo } from 'react';
import { useStyles } from './styles';
import useApp from '../../hooks/useApp';
import { useDispatch, useSelector } from 'react-redux';
import { mergeResultsSelector, removeItem, resolveComparable } from '../../reducers/mergeResults';
import { thoughtSelector } from '../../reducers/thoughts';
import { planSelector } from '../../reducers/plans';
import CurrentCompare from './CurrentCompare';
import CompareQueue from './CompareQueue';
import CurrentReview from './CurrentReview';
import MergeStage from './MergeStage';
import { CurrentItem, Item } from './types';
import { getBackupIdFromHistory } from './util';

export const Merge: FC = () => {
  const classes = useStyles({});
  const { history } = useApp();
  const dispatch = useDispatch();
  const { itemsToAdd, comparables } = useSelector(mergeResultsSelector);
  const itemsToAddWithoutStatuses = useMemo(() => itemsToAdd
    .filter(({ collectionName }) => collectionName !== 'status'), [itemsToAdd]);
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
    const backupId = getBackupIdFromHistory(history);
    if (backupId) {
      history.push(`/process-merge/${backupId}${history.location.search}`);
    }
  };

  return (
    <div className={classes.root}>
      {itemsToAddWithoutStatuses[currentItem.reviewIndex] && (
        <CurrentReview
          rootClassName={classes.currentReview}
          thoughts={thoughts}
          item={itemsToAddWithoutStatuses[currentItem.reviewIndex]}
          plans={plans}
          items={itemsToAddWithoutStatuses}
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
      <CompareQueue
        rootClassName={classes.compareQueue}
        comparables={comparables}
        currentItemIndex={currentItem.compareIndex}
        onClick={handleClickCompareQueue}
        onMerge={handleMerge}
      />
      <MergeStage
        rootClassName={classes.mergeStage}
        itemsToAdd={itemsToAddWithoutStatuses}
        currentItemIndex={currentItem.reviewIndex}
        onClick={handleClickMergeStage}
        onRemove={handleRemoveReview}
      />
    </div>
  );
};

export default Merge;
