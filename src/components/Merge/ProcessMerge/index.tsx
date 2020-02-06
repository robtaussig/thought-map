import React, { FC, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { mergeResultsSelector } from '../../../reducers/mergeResults';
import { thoughtSelector } from '../../../reducers/thoughts';
import { connectionSelector } from '../../../reducers/connections';
import { processItemsToAdd } from './util';
import { useLoadingOverlay } from '../../../hooks/useLoadingOverlay';
import { useLoadedDB } from '../../../hooks/useDB';
import useApp from '../../../hooks/useApp';
import { Item } from '../types';
import { useStyles } from './styles';

interface ProcessMergeProps {
  
}

export const ProcessMerge: FC<ProcessMergeProps> = () => {
  const classes = useStyles({});
  const { db } = useLoadedDB();
  const { history } = useApp();
  const rootRef = useRef<HTMLDivElement>(null);
  const [loading, stopLoading] = useLoadingOverlay(rootRef);
  const [filteredItemsToAdd, setFilteredItemsToAdd] = useState<Item[]>(null);
  const { itemsToAdd } = useSelector(mergeResultsSelector);
  const thoughts = useSelector(thoughtSelector);
  const connections = useSelector(connectionSelector);

  const handleClickMerge = async () => {
    loading('Merging data...');
    await Promise.all(filteredItemsToAdd.map(({ collectionName, item }) => {
      return db[collectionName].atomicUpsert(item);
    }));
    stopLoading();
    history.push('/');
  };

  useEffect(() => {
    if (itemsToAdd.length > 0) {
      loading('Processing results...');
      const filtered = processItemsToAdd(itemsToAdd, thoughts, connections);
      setFilteredItemsToAdd(filtered);
      stopLoading();
    }
  }, [itemsToAdd, thoughts, connections]);

  return (
    <div ref={rootRef} className={classes.root}>
      {filteredItemsToAdd && (
        <button
          className={classes.mergeButton}
          onClick={handleClickMerge}
        >
          Confirm Merge
        </button>
      )}
    </div>
  );
};

export default ProcessMerge;
