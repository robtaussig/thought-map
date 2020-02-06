import React, { FC, useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { mergeResultsSelector } from '../../../reducers/mergeResults';
import { thoughtSelector } from '../../../reducers/thoughts';
import { connectionSelector } from '../../../reducers/connections';
import { backupSelector } from '../../../reducers/backups';
import { processItemsToAdd } from './util';
import { getBackupIdFromHistory } from '../util';
import { useLoadingOverlay } from '../../../hooks/useLoadingOverlay';
import { useLoadedDB } from '../../../hooks/useDB';
import { backups as backupActions } from '../../../actions';
import useApp from '../../../hooks/useApp';
import { Item } from '../types';
import { useStyles } from './styles';
import { getSearchParam } from '../../../lib/util';

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
  const backups = useSelector(backupSelector);

  const handleClickMerge = async () => {
    loading('Merging data...');
    await Promise.all(filteredItemsToAdd.map(({ collectionName, item }) => {
      return db[collectionName].atomicUpsert(item);
    }));
    const version = getSearchParam(history, 'v');
    const backupId = getBackupIdFromHistory(history);
    const backup = backups.find(prev => prev.backupId === backupId);
    if (backup) {
      await backupActions.editBackup(db, {
        ...backup,
        version: Number(version),
        merged: true,
      });
    }
  
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
