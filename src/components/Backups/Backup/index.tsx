import React, { FC } from 'react';
import classNames from 'classnames';
import Edit from '@material-ui/icons/Edit';
import { Backup as BackupType } from '../../../store/rxdb/schemas/backup';

interface BackupProps {
  classes: any;
  backup: any;
  isUpdating: boolean;
  remoteVersion: number | string;
  isUpToDate: boolean;
  onClickEdit: (backup: BackupType) => () => void;
  onMerge: (backup: BackupType) => () => void;
  onPull: (backup: BackupType) => () => void;
  onPush: (backup: BackupType) => () => void;
  onViewPrivateKey: (backup: BackupType) => () => void;
  onDelete: (backup: BackupType) => () => void;
  onSetActive: (backup: BackupType) => () => void;
}

export const Backup: FC<BackupProps> = ({
  classes,
  backup,
  isUpdating,
  remoteVersion,
  isUpToDate,
  onClickEdit,
  onViewPrivateKey,
  onMerge,
  onPull,
  onPush,
  onDelete,
  onSetActive,
}) => (
  <div key={backup.backupId} className={classNames(classes.backup, {
    isUpdating,
  })}>
    <h3 className={classes.backupId}>
      {backup?.backupId ?? 'Loading...'}
    </h3>
    <div className={classNames(classes.updateStatus, {
      updateAvailable: remoteVersion > backup.version,
    })}>
      <span className={classNames(classes.version, {
        merged: backup.merged,
      })}>Local: v{backup.version}{backup.merged ? '*' : ''}</span>
      <span className={classes.version}>Remote: v{remoteVersion}</span>
    </div>
    <button
      className={classes.editButton}
      onClick={onClickEdit(backup)}
    >
      <Edit/>
    </button>
    <button
      className={classNames(classes.button, {
        privateKey: true,
      })}
      onClick={onViewPrivateKey(backup)}
    >
      View Private Key
    </button>
    <button
      className={classNames(classes.button, {
        merge: true,
      })}
      onClick={onMerge(backup)}
      disabled={isUpdating || isUpToDate}
    >
      Merge
    </button>
    <button
      className={classNames(classes.button, {
        pull: true,
      })}
      onClick={onPull(backup)}
      disabled={isUpdating || isUpToDate}
    >
      Pull
    </button>
    <button
      className={classNames(classes.button, {
        push: true,
      })}
      onClick={onPush(backup)}
      disabled={isUpdating || !isUpToDate}
    >
      Push
    </button>
    <button
      className={classNames(classes.button, {
        delete: true,
      })}
      onClick={onDelete(backup)}
      disabled={isUpdating}
    >
      Delete
    </button>
    <button
      className={classNames(classes.button, {
        active: true,
        isActive: backup.isActive,
      })}
      disabled={Boolean(backup.isActive || isUpdating)}
      onClick={onSetActive(backup)}
    >
      {backup.isActive ? 'Active' : 'Set Active'}
    </button>
  </div>
);

export default Backup;
