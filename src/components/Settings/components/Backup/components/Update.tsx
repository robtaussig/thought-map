import React, { FC, useState, MutableRefObject, useEffect } from 'react';
import Input from '../../../../General/Input';
import TextArea from '../../../../General/TextArea';
import { useLoadingOverlay } from '../../../../../hooks/useLoadingOverlay';
import useCrypto from '../../../../../hooks/useCrypto';
import { useLoadedDB } from '../../../../../hooks/useDB';
import { jsonDump } from '../../data';
import { chunkData } from '../util';
import { CHUNK_LENGTH } from '../constants';
import { updateChunk } from '../api';
import Check from '@material-ui/icons/Check';
import CloudUpload from '@material-ui/icons/CloudUpload';
import { backups as backupActions } from '../../../../../actions';

interface UpdateProps {
  classes: any;
  rootRef: MutableRefObject<HTMLDivElement>;
  toggleLock: (lock: boolean) => void;
}

export const Update: FC<UpdateProps> = ({ classes, rootRef, toggleLock }) => {
  const [id, setId] = useState<string>('');
  const [setLoading, stopLoading, updateText] = useLoadingOverlay(rootRef);
  const [privateKey, setPrivateKey] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [updated, setUpdated] = useState<boolean>(false);
  const db = useLoadedDB();
  const { encrypt } = useCrypto();

  const handleSubmit = async (e: any) => {
    setError('');
    toggleLock(true);
    e.preventDefault();
    if (!id || !privateKey) return;
    setLoading('Exporting Data...');
    const data = await jsonDump(db);
    const NUM_CHUNKS = Math.ceil(data.length / CHUNK_LENGTH);
    const chunks = chunkData(data, NUM_CHUNKS);
    updateText('Encrypting Data...');
    const encryptedChunks = await Promise.all(chunks.map(chunk => encrypt(chunk, privateKey)));
    try {
      updateText('Updating Data...');
      const responses = await Promise.all(encryptedChunks.map((chunk, idx) => updateChunk(chunk, idx, id, password)))
      if (responses.some(response => response instanceof Error)) {
        setError(responses.find(response => response instanceof Error).message);
      } else {
        backupActions.createBackup(db, {
          backupId: id,
          password,
          privateKey,
        });
        setUpdated(true);
      }
    } catch (e) {
      setError(e.message ?? e);
    } finally {
      stopLoading();
      toggleLock(false);
    }
  }

  return (
    <div className={classes.upload}>
      <form
        className={classes.uploadForm}
        onSubmit={handleSubmit}
      >
        <Input
          classes={classes}
          id={'id-input'}
          value={id}
          onChange={e => setId(e.target.value)}
          label={'Id'}
          autoFocus
        />
        <Input
          classes={classes}
          id={'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          label={'Password'}
          type={'password'}
        />
        <TextArea
          classes={classes}
          id={'private-key-textarea'}
          value={privateKey}
          onChange={e => setPrivateKey(e.target.value)}
          label={'Private Key'}
          inputProps={{ rows: 5 }}
        />
        {!updated && (
          <button
            className={classes.uploadButton}
            onClick={handleSubmit}
            disabled={!Boolean(id)}
          >
            <CloudUpload/>
          </button>
        )}
        {updated && (
          <span className={classes.uploadSuccess}>
            <Check/>
          </span>
        )}
      </form>
      {error && <span className={classes.errorMessage}>{error}</span>}
    </div>
  );
};

export default Update;
