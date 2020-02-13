import React, { FC, useState, useRef } from 'react';
import Input from '../../../General/Input';
import TextArea from '../../../General/TextArea';
import useCrypto from '../../../../hooks/useCrypto';
import { useLoadedDB } from '../../../../hooks/useDB';
import { useStyles } from './styles';
import { SetupStages } from './types';
import useApp from '../../../../hooks/useApp';
import { Backup } from '../../../../store/rxdb/schemas/backup';
import { backups as backupActions } from '../../../../actions';

interface SetupBackupProps {
  onClose: () => void;
  backup?: Backup;
}

export const SetupBackup: FC<SetupBackupProps> = ({ onClose, backup }) => {
  const classes = useStyles({});
  const rootRef = useRef(null);
  const { history } = useApp();
  const { db } = useLoadedDB();
  const [stage, setStage] = useState<SetupStages>(SetupStages.Id);
  const [id, setId] = useState<string>(backup?.backupId ?? '');
  const [password, setPassword] = useState<string>(backup?.password ?? '');
  const [privateKey, setPrivateKey] = useState<string>(backup?.privateKey ?? '');
  const { generatePrivateKey } = useCrypto();

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
    
    const nextVersion = 0;
    await backupActions.createBackup(db, {
      backupId: id,
      password,
      privateKey,
      version: nextVersion,
      isActive: false,
    });

    history.push('/backups');
    onClose();
  };

  return (
    <div className={classes.root} ref={rootRef}>
      <h1 className={classes.header}>Set up Pool</h1>
      {stage === SetupStages.Id && (
        <form className={classes.inputForm} onSubmit={handleSubmitId}>
          <Input
            classes={classes}
            value={id}
            id={'id-input'}
            onChange={e => setId(e.target.value)}
            label={'Enter pool name'}
            autoFocus={true}
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
            label={'Set a password that will be required to interact with your pool'}
            type={'password'}
            autoFocus={true}
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
            label={'Generate a private key (or use one previously generated). It will be used to encrypt and decrypt your pool-data client-side.'}
            inputProps={{ rows: 5 }}
            autoFocus={true}
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
    </div>
  );
};

export default SetupBackup;
