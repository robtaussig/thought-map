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
import { Item } from '../types';
import { useStyles } from './styles';
import { getSearchParam } from '../../../lib/util';
import { v4 as uuidv4 } from 'uuid';

export const ProcessMerge: FC = () => {
  const classes = useStyles({});
  const { db } = useLoadedDB();
  const rootRef = useRef<HTMLDivElement>(null);
  const [loading, stopLoading] = useLoadingOverlay(rootRef);
  const [filteredItemsToAdd, setFilteredItemsToAdd] = useState<Item[]>(null);
  const { itemsToAdd, deletionsToAdd, itemsToRemove } = useSelector(mergeResultsSelector);
  const thoughts = useSelector(thoughtSelector);
  const connections = useSelector(connectionSelector);
  const backups = useSelector(backupSelector);

  const handleClickMerge = async () => {
    loading('Merging data...');
    (window as any).blockDBSubscriptions = true;
    await Promise.all(
      filteredItemsToAdd.map(({ collectionName, item }) => {
        return db[collectionName].atomicUpsert(item);
      }).concat(
        deletionsToAdd.map(deletion => {
          return db['deletion'].atomicUpsert({
            id: uuidv4(),
            ...deletion,
          });
        })
      ).concat(
        itemsToRemove.map(({ collectionName, item}) => {
          const query = db[collectionName].find().where('id').eq(item.id);
          return query.remove();
        })
      ),
    );
    const version = getSearchParam('v');
    const backupId = getBackupIdFromHistory();
    const backup = backups.find(prev => prev.backupId === backupId);
    if (backup) {
      await backupActions.editBackup(db, {
        ...backup,
        version: Number(version),
        merged: true,
      });
    }
  
    (window as any).blockDBSubscriptions = false;
    location.href = '/';
  };

  useEffect(() => {
    if (itemsToAdd.length > 0) {
      loading('Processing results...');
      const filtered = processItemsToAdd(itemsToAdd, thoughts, connections);
      setFilteredItemsToAdd(filtered);
      stopLoading();
    } else if (deletionsToAdd.length > 0 || itemsToRemove.length > 0) {
      setFilteredItemsToAdd([]);
    }
  }, [itemsToAdd, thoughts, connections, deletionsToAdd, itemsToRemove]);

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
