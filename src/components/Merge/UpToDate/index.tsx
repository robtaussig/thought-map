import React, { FC, useEffect } from 'react';
import { useIdFromUrl, useSearchParam } from '../../../lib/util';
import { backupSelector } from '../../../reducers/backups';
import { useSelector } from 'react-redux';
import { backups as backupActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';

interface UpToDateProps {
  classes: any;
}

export const UpToDate: FC<UpToDateProps> = ({ classes }) => {
  const { db } = useLoadedDB();
  const backups = useSelector(backupSelector);
  const backupId = useIdFromUrl('merge');
  const localBackup = backups.find(prev => prev.backupId === backupId);
  const version = useSearchParam('v');
  useEffect(() => {
    
    
    if (localBackup && version && Number(version) !== localBackup.version) {
      backupActions.editBackup(db, {
        ...localBackup,
        version: Number(version),
      });
    }
  }, [version, localBackup]);

  return (
    <div className={classes.upToDate}>
      Up to date!
    </div>
  );
};

export default UpToDate;
