import React, { FC, memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { backupSelector } from '../../../reducers/backups';
import { jsonDump } from '../../../components/Settings/components/Data';
import { getVersion, updateChunk } from '../../../components/Settings/components/SetupBackup/api';
import { useLoadedDB } from '../../../hooks/useDB';
import { backups as backupActions } from '../../../actions';
import { chunkData } from '../../../components/Settings/components/SetupBackup/util';
import { CHUNK_LENGTH } from '../../../components/Settings/components/SetupBackup/constants';
import useCrypto from '../../../hooks/useCrypto';
import CircleButton from '../../../components/General/CircleButton';
import { Check, CloudUpload, Refresh } from '@material-ui/icons';

export interface DemandBackupButtonProps {
  className?: string;
  classes: any;
}

export const DemandBackupButton: FC<DemandBackupButtonProps> = ({
  classes,
}) => {
  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState<boolean>(false);
  const backups = useSelector(backupSelector);
  const { db } = useLoadedDB();
  const { encrypt } = useCrypto();

  const handleDemandBackup = async () => {
    setUpdating(true);
    let activeBackup;
    try {
      activeBackup = backups.find(backup => backup.isActive);

      if (activeBackup) {
        const { password, privateKey, backupId, version } = activeBackup;
        const currentVersion = await getVersion(backupId);
        const nextVersion = Number(currentVersion?.version ?? version) + 1;
        const data = await jsonDump(db);
        const NUM_CHUNKS = Math.ceil(data.length / CHUNK_LENGTH);
        const chunks = chunkData(data, NUM_CHUNKS);
        await backupActions.editBackup(db, {
          ...activeBackup,
          version: nextVersion,
          merged: false,
        });
        const encryptedChunks = await Promise.all(chunks.map(chunk => encrypt(chunk, privateKey)));
        await Promise.all(encryptedChunks.map((chunk, idx) => updateChunk(chunk, idx, backupId, password, nextVersion, encryptedChunks.length)));
        
        setUpdated(true);
        setTimeout(() => {
          setUpdated(false);
        }, 2000);
      } else {
        throw new Error('No active backup');
      }
    } catch (e) {
      backupActions.editBackup(db, {
        ...activeBackup,
        version: activeBackup.version,
        merged: false,
      });
      alert(e);
    } finally {
      setUpdating(false);
    }
  };

  if (updated) {
    return (
      <CircleButton
        id={'updated'}
        onClick={null}
        classes={classes}
        label={'Updated'}
        disabled={true}
        Icon={Check}
      />
    );
  }
  if (updating) {
    return (
      <CircleButton
        id={'updating-button'}
        onClick={null}
        classes={classes}
        label={'Updating'}
        disabled={true}
        Icon={Refresh}
      />
    );
  }

  return (
    <CircleButton
      onClick={handleDemandBackup}
      classes={classes}
      label={'Upload Data'}
      Icon={CloudUpload}
    />
  );
};

export default memo(DemandBackupButton);
