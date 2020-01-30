import React, { FC, useState, useEffect } from 'react';
import { useStyles } from './styles';
import { useSelector } from 'react-redux';
import { backupSelector } from '../../reducers/backups';
import { Backup } from '../../store/rxdb/schemas/backup';
import { backups as backupActions } from '../../actions';
import classNames from 'classnames';
import { useLoadedDB } from '../../hooks/useDB';
import useCrypto from '../../hooks/useCrypto';
import { getVersion } from '../Settings/components/Backup/api';
import { openConfirmation } from '../../lib/util';
import { jsonDump, download } from '../Settings/components/data';
import { CHUNK_LENGTH } from '../Settings/components/Backup/constants';
import { chunkData, buildDechunker } from '../Settings/components/Backup/util';
import { updateChunk, fetchBackup } from '../Settings/components/Backup/api';

interface BackupsProps {
  
}

export const Backups: FC<BackupsProps> = () => {
  const db = useLoadedDB();
  const classes = useStyles({});
  const { encrypt, decrypt } = useCrypto();
  const backups = useSelector(backupSelector);
  const [currentVersions, setCurrentVersions] = useState<{ [backupId: string]: number }>({});
  const [updating, setUpdating] = useState<{ [backupId: string]: boolean }>({});
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
    const confirm = () => {
      backupActions.deleteBackup(db, backup.id);
    };

    openConfirmation('Are you sure you want to delete this backup?', confirm);
  }

  const handlePull = (backup: Backup) => async () => {
    const { backupId, password, privateKey } = backup;
    setUpdating(prev => ({
      ...prev,
      [backup.backupId]: true,
    }));
    try {
      const response = await fetchBackup(backupId, password);
      if (response instanceof Error) {
        alert(response);
      } else {
        const dechunker = buildDechunker(decrypt);
        const decrypted = await dechunker(response.chunks, privateKey);
        backupActions.editBackup(db, {
          ...backup,
          version: Number(response.version),
        });
        download(decrypted);
      }
    } catch(e) {
      alert(e);
    } finally {
      setUpdating(prev => ({
        ...prev,
        [backup.backupId]: false,
      }));
    }
  };

  const handlePush = (backup: Backup) => async () => {
    setUpdating(prev => ({
      ...prev,
      [backup.backupId]: true,
    }));
    try {
      const { password, privateKey, backupId, version } = backup;
      const nextVersion = (currentVersions[backupId] ?? version) + 1;
      const data = await jsonDump(db);
      const NUM_CHUNKS = Math.ceil(data.length / CHUNK_LENGTH);
      const chunks = chunkData(data, NUM_CHUNKS);
      const encryptedChunks = await Promise.all(chunks.map(chunk => encrypt(chunk, privateKey)));
      await Promise.all(encryptedChunks.map((chunk, idx) => updateChunk(chunk, idx, backupId, password, nextVersion)));
      setCurrentVersions(prev => ({
        ...prev,
        [backup.backupId]: nextVersion,
      }));
      backupActions.editBackup(db, {
        ...backup,
        version: nextVersion,
      });
    } catch (e) {
      alert(e);
    } finally {
      setUpdating(prev => ({
        ...prev,
        [backup.backupId]: false,
      }));
    }
  };

  useEffect(() => {
    const getLatestVersions = async () => {
      const versions: { version: number }[] = await Promise.all(backups.map(backup => getVersion(backup.backupId)));
      setCurrentVersions(backups.reduce((next, { backupId }, idx) => {
        next[backupId] = Number(versions[idx].version);
        return next;
      }, {} as { [backupId: string]: number }))
    };
    getLatestVersions();
  }, [backups]);

  return (
    <div className={classes.root}>
      <h1 className={classes.header}>Backups</h1>
      {backups.map((backup, idx) => {
        const justCopied = lastCopied === backup.backupId;
        const remoteVersion = currentVersions[backup.backupId] ?? '...';
        const isUpdating = Boolean(updating[backup.backupId]);
        const isUpToDate = remoteVersion === backup.version;

        return (
          <div key={backup.backupId} className={classNames(classes.backup, {
            isUpdating,
          })}>
            <h3 className={classes.backupId}>
              {backup?.backupId ?? 'Loading...'}
            </h3>
            <div className={classNames(classes.updateStatus, {
              updateAvailable: remoteVersion > backup.version,
            })}>
              <span className={classes.version}>Local: v{backup.version}</span>
              <span className={classes.version}>Remote: v{remoteVersion}</span>
            </div>
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
              disabled={isUpdating || isUpToDate}
            >
              Pull
            </button>
            <button
              className={classNames(classes.button, {
                push: true,
              })}
              onClick={handlePush(backup)}
              disabled={isUpdating}
            >
              Push
            </button>
            <button
              className={classNames(classes.button, {
                delete: true,
              })}
              onClick={handleDelete(backup)}
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
              onClick={handleSetActive(backup)}
            >
              {backup.isActive ? 'Active' : 'Set Active'}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Backups;
