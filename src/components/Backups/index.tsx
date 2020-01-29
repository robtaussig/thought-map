import React, { FC, useState } from 'react';
import { useStyles } from './styles';
import { useSelector } from 'react-redux';
import { backupSelector } from '../../reducers/backups';
import { Backup } from '../../store/rxdb/schemas/backup';
import { backups as backupActions } from '../../actions';
import classNames from 'classnames';
import { format } from 'date-fns';
import { useLoadedDB } from '../../hooks/useDB';

interface BackupsProps {
  
}

export const Backups: FC<BackupsProps> = () => {
  const db = useLoadedDB();
  const classes = useStyles({});
  const backups = useSelector(backupSelector);
  const [lastCopied, setLastCopied] = useState<string>(null);

  const handleCopyPrivateKey = (backup: Backup) => () => {
    navigator.clipboard.writeText(backup.privateKey);
    setLastCopied(backup.backupId);
  };

  const handleSetActive = (backup: Backup) => async () => {
    const previousActive = backups.find(prevBackup => prevBackup.isActive);
    if (previousActive) {
      await backupActions.editBackup(db, {
        ...previousActive,
        isActive: false,
      });
    }
    backupActions.editBackup(db, {
      ...backup,
      isActive: true,
    });
  };

  const handleDelete = (backup: Backup) => () => {
    alert('Coming Soon');
  };

  const handlePull = (backup: Backup) => () => {
    alert('Coming Soon');
  };

  const handlePush = (backup: Backup) => () => {
    alert('Coming Soon');
  };

  return (
    <div className={classes.root}>
      <h1 className={classes.header}>Backups (In Development)</h1>
      {backups.map((backup, idx) => {
        const justCopied = lastCopied === backup.backupId;

        return (
          <div key={backup.backupId} className={classes.backup}>
            <h3 className={classes.backupId}>
              {backup?.backupId ?? 'Loading...'}
            </h3>
            {backup && (<span className={classNames(classes.syncDate, {
              updateAvailable: false,
            })}>
              Synced at {format(new Date(backup?.updated), 'yyyy-MM-dd HH:mm')}
            </span>)}
            <button
              className={classNames(classes.button, {
                privateKey: true,
                lastCopied: justCopied,
              })}
              onClick={handleCopyPrivateKey(backup)}
            >
              {justCopied ? 'Copied' : 'Copy private key'}
            </button>
            <button
              className={classNames(classes.button, {
                pull: true,
              })}
              onClick={handlePull(backup)}
            >
              Pull
            </button>
            <button
              className={classNames(classes.button, {
                push: true,
              })}
              onClick={handlePush(backup)}
            >
              Push
            </button>
            <button
              className={classNames(classes.button, {
                delete: true,
              })}
              onClick={handleDelete(backup)}
            >
              Delete
            </button>
            <button
              className={classNames(classes.button, {
                active: true,
                isActive: backup?.isActive,
              })}
              disabled={Boolean(backup?.isActive)}
              onClick={handleSetActive(backup)}
            >
              Set Active
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Backups;
