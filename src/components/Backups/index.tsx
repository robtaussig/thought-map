import React, { FC, useState, useEffect, useRef } from 'react';
import { Backup } from '../../store/rxdb/schemas/backup';
import { backups as backupActions } from '../../actions';
import { backupSelector } from '../../reducers/backups';
import { CHUNK_LENGTH } from '../Settings/components/SetupBackup/constants';
import { chunkData, buildDechunker } from '../Settings/components/SetupBackup/util';
import { Dump } from '../Merge/types';
import { getVersion } from '../Settings/components/SetupBackup/api';
import { jsonDump, download } from '../Settings/components/Data';
import { merge } from '../Merge/util';
import { openConfirmation } from '../../lib/util';
import { setMergeResults } from '../../reducers/mergeResults';
import { updateChunk, fetchBackup } from '../Settings/components/SetupBackup/api';
import { useLoadedDB } from '../../hooks/useDB';
import { useSelector, useDispatch } from 'react-redux';
import { useStyles } from './styles';
import Add from '@material-ui/icons/Add';
import BackupItem from './Backup';
import ViewPrivateKey from './ViewPrivateKey';
import SetupBackup from '../Settings/components/SetupBackup';
import useApp from '../../hooks/useApp';
import useCrypto from '../../hooks/useCrypto';
import useModal from '../../hooks/useModal';

export const Backups: FC = () => {
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

    openConfirmation('Are you sure you want to delete this pool?', confirm);
  }

  const handleMerge = (backup: Backup) => async () => {
    if (!backup) {
      alert('No pool')
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
        //Hack after upgrading rxdb
        const dump: unknown = await db.dump();
        const mergeResults = merge(dump as Dump, parsed);

        dispatch(setMergeResults(mergeResults));

        history.push(`/merge/${backupId}?v=${response.version}`);
      }
    } catch(e) {
      setUpdating(prev => ({
        ...prev,
        [backup.backupId]: false,
      }));
      alert(`Unable to decrypt the pool. This is most likely caused by using a different private key than the one used to encrypt the pool`);
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
      alert(`Unable to decrypt the pool. This is most likely caused by using a different private key than the one used to encrypt the pool`);
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
        encryptedChunks.map((chunk, idx) => updateChunk(chunk, idx, backupId, password, nextVersion, encryptedChunks.length))
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

  const handleClickEdit = (backup?: Backup) => () => {
    openModal(
      <SetupBackup
        onClose={closeModal}
        backup={backup}
      />, 'Edit Backup'
    );
  };

  const handleViewPrivateKey = (backup: Backup) => () => {
    openModal(
      <ViewPrivateKey
        backup={backup}
      />, 'PrivateKey'
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
      <h1 className={classes.header}>Pools</h1>
      <ul className={classes.backupsList}>
        {backups.map((backup, idx) => {
          const remoteVersion = currentVersions[backup.backupId] ?? '...';
          const isUpdating = Boolean(updating[backup.backupId]);
          const isUpToDate = remoteVersion === backup.version;

          return (
            <BackupItem
              key={backup.id}
              classes={classes}
              backup={backup}
              isUpdating={isUpdating}
              remoteVersion={remoteVersion}
              isUpToDate={isUpToDate}
              onClickEdit={handleClickEdit}
              onMerge={handleMerge}
              onPull={handlePull}
              onPush={handlePush}
              onDelete={handleDelete}
              onSetActive={handleSetActive}
              onViewPrivateKey={handleViewPrivateKey}
            />
          );
        })}
      </ul>
      <button
        className={classes.addButton}
        onClick={handleClickEdit()}
      >
        <Add/>
      </button>
    </div>
  );
};

export default Backups;
