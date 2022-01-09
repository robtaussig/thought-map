import React, { FC, useEffect } from 'react';
import { getSearchParam, getIdFromUrl } from '../../../lib/util';
import { useNavigate } from 'react-router-dom';
import { backupSelector } from '../../../reducers/backups';
import { useSelector } from 'react-redux';
import { backups as backupActions } from '../../../actions';
import { useLoadedDB } from '../../../hooks/useDB';

interface UpToDateProps {
  classes: any;
}

export const UpToDate: FC<UpToDateProps> = ({ classes }) => {
  const navigate = useNavigate();
  const { db } = useLoadedDB();
  const backups = useSelector(backupSelector);
  const backupId = getIdFromUrl('merge');
  const localBackup = backups.find(prev => prev.backupId === backupId);

  useEffect(() => {
    const version = getSearchParam('v');
    
    if (localBackup && version && Number(version) !== localBackup.version) {
      backupActions.editBackup(db, {
        ...localBackup,
        version: Number(version),
      });
    }
  }, [localBackup]);

  return (
    <div className={classes.upToDate}>
      Up to date!
    </div>
  );
};

export default UpToDate;
