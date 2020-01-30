import React, { FC, useState, useRef } from 'react';
import Input from '../../../../../General/Input';
import TextArea from '../../../../../General/TextArea';
import useCrypto from '../../../../../../hooks/useCrypto';
import { CHUNK_LENGTH } from '../../constants';
import { useLoadedDB } from '../../../../../../hooks/useDB';
import { useLoadingOverlay } from '../../../../../../hooks/useLoadingOverlay';
import { useStyles } from './styles';
import { SetupStages } from './types';
import { jsonDump } from '../../../data';
import { chunkData } from '../../util';
import { updateChunk, getVersion } from '../../api';
import { backups as backupActions } from '../../../../../../actions';

interface SetupBackupProps {
  onClose: () => void;
}

export const SetupBackup: FC<SetupBackupProps> = ({ onClose }) => {
  const classes = useStyles({});
  const rootRef = useRef(null);
  const db = useLoadedDB();
  const [stage, setStage] = useState<SetupStages>(SetupStages.Id);
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { encrypt, generatePrivateKey } = useCrypto();
  const [setLoading, stopLoading] = useLoadingOverlay(rootRef);

  const handleSubmitId = (e: any) => {
    e.preventDefault();
    if (id === '') return;
    setStage(SetupStages.Password);
  };

  const handleSubmitPassword = (e: any) => {
    e.preventDefault();
    if (password === '') return;
    setStage(SetupStages.PrivateKey);
  };

  const handleGeneratePrivateKey = async (e: any) => {
    e.preventDefault();
    const key = await generatePrivateKey();
    setPrivateKey(key);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading('Encrypting and uploading your data');
    const data = await jsonDump(db);
    const NUM_CHUNKS = Math.ceil(data.length / CHUNK_LENGTH);
    const chunks = chunkData(data, NUM_CHUNKS);
    const encryptedChunks = await Promise.all(chunks.map(chunk => encrypt(chunk, privateKey)));
    const currentVersion = await getVersion(id);
    const nextVersion = Number(currentVersion?.version ?? 1);
    try {
      const responses = await Promise.all(encryptedChunks.map((chunk, idx) => updateChunk(chunk, idx, id, password, nextVersion)))
      if (responses.some(response => response instanceof Error)) {
        stopLoading();
        setError(responses.find(response => response instanceof Error).message);
      } else {
        backupActions.createBackup(db, {
          backupId: id,
          password,
          privateKey,
          version: nextVersion,
          isActive: true,
        });
        stopLoading();
        onClose();
      }
    } catch (e) {
      stopLoading();
      setError(e?.message ?? e);
    }
  };

  return (
    <div className={classes.root} ref={rootRef}>
      <h1 className={classes.header}>Set up Automatic backups</h1>
      {stage === SetupStages.Id && (
        <form className={classes.inputForm} onSubmit={handleSubmitId}>
          <Input
            classes={classes}
            value={id}
            id={'id-input'}
            onChange={e => setId(e.target.value)}
            label={'Set a unique ID that will be used to identify your backup'}
          />
          <button
            className={classes.nextButton}
            onClick={() => setStage(SetupStages.Password)}
            disabled={id === ''}
          >
            Next
          </button>
        </form>
      )}
      {stage === SetupStages.Password && (
        <form className={classes.inputForm} onSubmit={handleSubmitPassword}>
          <Input
            classes={classes}
            value={password}
            id={'password-input'}
            onChange={e => setPassword(e.target.value)}
            label={'Set a password that will be required to write over your existing backup'}
            type={'password'}
          />
          <button
            className={classes.nextButton}
            onClick={() => setStage(SetupStages.PrivateKey)}
            disabled={password === ''}
          >
            Next
          </button>
        </form>
      )}
      {stage === SetupStages.PrivateKey && (
        <form className={classes.inputForm} onSubmit={handleGeneratePrivateKey}>
          <TextArea
            classes={classes}
            id={'private-key-textarea'}
            value={privateKey}
            onChange={e => setPrivateKey(e.target.value)}
            label={'Generate a private key (or use one previously generated). It will be used to encrypt and decrypt your data client-side.'}
            inputProps={{ rows: 5 }}
          />
          {privateKey === '' ? (
            <button
              className={classes.nextButton}
              onClick={handleGeneratePrivateKey}
            >
              Generate
            </button>
          ) : (
            <button
              className={classes.submitButton}
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </form>
      )}
      {error && (
        <span className={classes.errorMessage}>{error}</span>
      )}
    </div>
  );
};

export default SetupBackup;
