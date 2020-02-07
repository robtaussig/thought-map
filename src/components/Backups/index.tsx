import React, { FC, useState, useEffect, useRef } from 'react';
import { useStyles } from './styles';
import { useSelector, useDispatch } from 'react-redux';
import { backupSelector } from '../../reducers/backups';
import { Backup } from '../../store/rxdb/schemas/backup';
import Edit from '@material-ui/icons/Edit';
import { backups as backupActions } from '../../actions';
import classNames from 'classnames';
import { useLoadedDB } from '../../hooks/useDB';
import useCrypto from '../../hooks/useCrypto';
import useApp from '../../hooks/useApp';
import useModal from '../../hooks/useModal';
import { getVersion } from '../Settings/components/SetupBackup/api';
import { openConfirmation } from '../../lib/util';
import { jsonDump, download } from '../Settings/components/Data';
import { CHUNK_LENGTH } from '../Settings/components/SetupBackup/constants';
import { chunkData, buildDechunker } from '../Settings/components/SetupBackup/util';
import { updateChunk, fetchBackup } from '../Settings/components/SetupBackup/api';
import { Dump } from '../Merge/types';
import SetupBackup from '../Settings/components/SetupBackup';
import { merge } from '../Merge/util';
import { setMergeResults } from '../../reducers/mergeResults';

interface BackupsProps {
  
}

export const Backups: FC<BackupsProps> = () => {
  const { db } = useLoadedDB();
  const dispatch = useDispatch();
  const { history } = useApp();
  const classes = useStyles({});
  const [openModal, closeModal] = useModal();
  const { encrypt, decrypt } = useCrypto();
  const backups = useSelector(backupSelector);
  const hasEnforcedSingleBackup = useRef<boolean>(false);
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

  const handleMerge = (backup: Backup) => async () => {
    if (!backup) {
      alert('No backup')
      return;
    }
    const { backupId, password, privateKey } = backup;
    setUpdating(prev => ({
      ...prev,
      [backup.backupId]: true,
    }));

    try {
      const response = await fetchBackup(backupId, password);
      if (response instanceof Error) {
        setUpdating(prev => ({
          ...prev,
          [backup.backupId]: false,
        }));
        alert(response);
      } else {
        const dechunker = buildDechunker(decrypt);
        const decrypted = await dechunker(response.chunks, privateKey);

        const decoded = decodeURIComponent(decrypted).slice('data:application/json;charset=utf-8,'.length);
        const parsed = JSON.parse(decoded);
        const dump: Dump = await db.dump();
        const { itemsToAdd, comparables } = merge(dump, parsed);

        dispatch(setMergeResults({
          itemsToAdd, comparables
        }));

        history.push(`/merge/${backupId}?v=${response.version}`);
      }
    } catch(e) {
      setUpdating(prev => ({
        ...prev,
        [backup.backupId]: false,
      }));
      alert(`Unable to decrypt the backup. This is most likely caused by using a different private key than the one used to encrypt the backup`);
    }
  };

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
        download(decrypted, `${backupId}_${response.version}`);
      }
    } catch(e) {
      alert(`Unable to decrypt the backup. This is most likely caused by using a different private key than the one used to encrypt the backup`);
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
      const { password, privateKey, backupId, version, merged } = backup;
      const nextVersion = (currentVersions[backupId] ?? version) + 1;
      await backupActions.editBackup(db, {
        ...backup,
        version: nextVersion,
        merged: false,
      });
      const data = await jsonDump(db);
      const NUM_CHUNKS = Math.ceil(data.length / CHUNK_LENGTH);
      const chunks = chunkData(data, NUM_CHUNKS);
      const encryptedChunks = await Promise.all(chunks.map(chunk => encrypt(chunk, privateKey)));
      const results = await Promise.all(
        encryptedChunks.map((chunk, idx) => updateChunk(chunk, idx, backupId, password, nextVersion))
      );
      if (results.some(result => result instanceof Error)) {
        backupActions.editBackup(db, backup);
        alert(results.find(result => result instanceof Error).message);
      } else {
        setCurrentVersions(prev => ({
          ...prev,
          [backup.backupId]: nextVersion,
        }));
      }
    } catch (e) {
      alert(e);
    } finally {
      setUpdating(prev => ({
        ...prev,
        [backup.backupId]: false,
      }));
    }
  };

  const handleClickEdit = (backup: Backup) => () => {
    openModal(
      <SetupBackup
        onClose={closeModal}
        backup={backup}
      />, 'Edit Backup'
    );
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
    if (hasEnforcedSingleBackup.current === false && backups.length > 0) {
      hasEnforcedSingleBackup.current = true;
      const ensureSingleActiveBackup = async () => {
        if (backups.filter(({ isActive }) => isActive).length > 1) {
          const [remainActive, unActive] = backups.reduce((next, backup) => {
            if (backup.isActive) {
              if (!next[0]) {
                return [backup, next[1]];
              } else if (next[0].updated < backup.updated) {
                return [backup, next[1].concat(next[0])];
              } else {
                return [next[0], next[1].concat(backup)];
              }
            }
            return next;
          }, [null, []] as [Backup, Backup[]])
  
          for (let backup of unActive) {
            await backupActions.editBackup(db, {
              ...backup,
              isActive: false,
            });
          }
        }
      };
      ensureSingleActiveBackup();
    }
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
              <span className={classNames(classes.version, {
                merged: backup.merged,
              })}>Local: v{backup.version}{backup.merged ? '*' : ''}</span>
              <span className={classes.version}>Remote: v{remoteVersion}</span>
            </div>
            <button
              className={classes.editButton}
              onClick={handleClickEdit(backup)}
            >
              <Edit/>
            </button>
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
                merge: true,
              })}
              onClick={handleMerge(backup)}
              disabled={isUpdating || isUpToDate}
            >
              Merge
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
