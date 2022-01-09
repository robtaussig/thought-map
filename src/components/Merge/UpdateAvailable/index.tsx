import React, { FC, useRef } from 'react';
import { useStyles } from './styles';
import { useDispatch } from 'react-redux';
import { Backup } from '../../../store/rxdb/schemas/backup';
import { useLoadingOverlay } from '../../../hooks/useLoadingOverlay';
import useCrypto from '../../../hooks/useCrypto';
import { useLoadedDB } from '../../../hooks/useDB';
import { useNavigate } from 'react-router-dom';
import Tooltip from '../../General/Tooltip';
import { setMergeResults } from '../../../reducers/mergeResults';
import classNames from 'classnames';
import { fetchBackup } from '../../Settings/components/SetupBackup/api';
import { buildDechunker } from '../../Settings/components/SetupBackup/util';
import { merge } from '../util';
import { Dump } from '../types';

interface UpdateAvailableProps {
  activeBackup: Backup;
  latestVersion: number;
  onClose: () => void;
}

const MERGE_TOOLTIP_TEXT =
  `The backup data will be downloaded and you will have an opportunity
  to select which changes to keep`;

export const UpdateAvailable: FC<UpdateAvailableProps> = ({ activeBackup, latestVersion, onClose }) => {
  const classes = useStyles({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const { db } = useLoadedDB();
  const { decrypt } = useCrypto();
  const [loading, stopLoading, updateText] = useLoadingOverlay(rootRef);

  const handleClickMergeButton = async () => {
    const { backupId, password, privateKey } = activeBackup;
    loading('Fetching backup...');

    try {
      const response = await fetchBackup(backupId, password);
      if (response instanceof Error) {
        stopLoading();
        alert(response);
      } else {
        updateText('Decrypting...');
        const dechunker = buildDechunker(decrypt);
        const decrypted = await dechunker(response.chunks, privateKey);

        const decoded = decodeURIComponent(decrypted).slice('data:application/json;charset=utf-8,'.length);
        const parsed = JSON.parse(decoded);
        const dump: unknown = await db.exportJSON(true);
        const mergeResults = merge(dump as Dump, parsed);
        stopLoading();
        dispatch(setMergeResults(mergeResults));
        navigate(`/merge/${backupId}?v=${response.version}`);
        onClose();
      }
    } catch(e) {
      stopLoading();
      alert(`Unable to decrypt the backup. This is most likely caused by using a different private key than the one used to encrypt the backup`);
    }
  };

  return (
    <div ref={rootRef} className={classes.root}>
      <h1 className={classes.header}>Update Available for</h1>
      <span className={classes.backupId}>{activeBackup.backupId}</span>
      <span className={classNames(classes.field, 'current')}>Current Version:</span>
      <span className={classNames(classes.value, 'current')}>{activeBackup.version}</span>
      <span className={classNames(classes.field, 'latest')}>Available Version:</span>
      <span className={classNames(classes.value, 'latest')}>{latestVersion}</span>
      <div className={classes.buttonWrapper}>
        <button className={classes.mergeButton} onClick={handleClickMergeButton}>
          Merge Changes
        </button>
        <Tooltip className={'tooltip'} text={MERGE_TOOLTIP_TEXT} />
      </div>
    </div>
  );
};

export default UpdateAvailable;
