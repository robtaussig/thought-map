import React, { FC, useState, useMemo } from 'react';
import { useStyles } from './styles';
import useApp from '../../hooks/useApp';
import { useDispatch, useSelector } from 'react-redux';
import {
  mergeResultsSelector,
  removeItem,
  resolveComparable,
  acceptDeletion,
  rejectDeletion,
} from '../../reducers/mergeResults';
import { thoughtSelector } from '../../reducers/thoughts';
import { planSelector } from '../../reducers/plans';
import CurrentCompare from './CurrentCompare';
import CompareQueue from './CompareQueue';
import RemovableQueue from './RemovableQueue';
import CurrentReview from './CurrentReview';
import MergeStage from './MergeStage';
import CurrentRemovable from './CurrentRemovable';
import { CurrentItem, Item } from './types';
import { getBackupIdFromHistory } from './util';
import { Deletion } from '../../store/rxdb/schemas/deletion';

export const Merge: FC = () => {
  const classes = useStyles({});
  const { history } = useApp();
  const dispatch = useDispatch();
  const {
    itemsToAdd,
    comparables,
    removables,
  } = useSelector(mergeResultsSelector);
  const itemsToAddWithoutStatuses = useMemo(() => itemsToAdd
    .filter(({ collectionName }) => collectionName !== 'status'), [itemsToAdd]);

  const thoughts = useSelector(thoughtSelector);
  const plans = useSelector(planSelector);
  const [currentItem, setCurrentItem] = useState<CurrentItem>({
    compareIndex: 0,
    reviewIndex: null,
    removableIndex: null,
  });

  const handleClickCompareQueue = (index: number) => {
    setCurrentItem({
      compareIndex: index,
      reviewIndex: null,
      removableIndex: null,
    });
  };

  const handleClickMergeStage = (index: number) => {
    setCurrentItem({
      compareIndex: null,
      reviewIndex: index,
      removableIndex: null,
    });
  };

  const handleClickRemovableQueue = (index: number) => {
    setCurrentItem({
      compareIndex: null,
      reviewIndex: null,
      removableIndex: index,
    });
  };

  const handleRemoveReview = () => {
    const item = itemsToAddWithoutStatuses[currentItem.reviewIndex];
    const adjustedIndex = itemsToAdd.indexOf(item);
    dispatch(removeItem(adjustedIndex));
  };

  const handlePick = (item: Item) => {
    dispatch(resolveComparable({ comparableIndex: currentItem.compareIndex, item }));
  };

  const handlePickRemovable = (pickRemove: boolean) => {
    if (pickRemove) {
      dispatch(acceptDeletion(currentItem.removableIndex));
    } else {
      dispatch(rejectDeletion(currentItem.removableIndex));
    }
  };

  const handleMerge = () => {
    const backupId = getBackupIdFromHistory(history);
    if (backupId) {
      history.push(`/process-merge/${backupId}${history.location.search}`);
    }
  };

  const upToDate = itemsToAddWithoutStatuses.length + comparables.length + removables.length === 0;

  if (upToDate) return (
    <div className={classes.upToDate}>
      Up to date!
    </div>
  );

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
      {removables[currentItem.removableIndex] && (
        <CurrentRemovable
          rootClassName={classes.currentRemovable}
          removable={removables[currentItem.removableIndex]}
          onPick={handlePickRemovable}
          thoughts={thoughts}
          plans={plans}
        />
      )}
      <CompareQueue
        rootClassName={classes.compareQueue}
        comparables={comparables}
        currentItemIndex={currentItem.compareIndex}
        onClick={handleClickCompareQueue}
        onMerge={handleMerge}
        mergable={(comparables.length + removables.length) === 0}
      />
      <RemovableQueue
        rootClassName={classes.removableQueue}
        removables={removables}
        currentItemIndex={currentItem.removableIndex}
        onClick={handleClickRemovableQueue}
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
