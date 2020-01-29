import React, { FC, useState, MutableRefObject } from 'react';
import Input from '../../../../General/Input';
import TextArea from '../../../../General/TextArea';
import { useLoadingOverlay } from '../../../../../hooks/useLoadingOverlay';
import useCrypto from '../../../../../hooks/useCrypto';
import { download } from '../../data';
import { buildDechunker } from '../util';
import { fetchBackup } from '../api';
import CloudDownload from '@material-ui/icons/CloudDownload';

interface RetrieveProps {
  classes: any;
  rootRef: MutableRefObject<HTMLDivElement>;
  toggleLock: (lock: boolean) => void;
}

export const Retrieve: FC<RetrieveProps> = ({ classes, rootRef, toggleLock }) => {
  const [id, setId] = useState<string>('');
  const [setLoading, stopLoading, updateText] = useLoadingOverlay(rootRef);
  const [privateKey, setPrivateKey] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [encryptedChunks, setEncryptedChunks] = useState<string[]>(null);
  const [decrypted, setDecrypted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { decrypt } = useCrypto();
  
  const handleSubmit = async (e: any) => {
    setError('');
    toggleLock(true);
    e.preventDefault();
    if (!id) return;
    setLoading('Downloading...');
    try {
      const response = await fetchBackup(id, password);
      if (response instanceof Error) {
        setError(response.message);
      } else {
        setEncryptedChunks(response.chunks);
      }
    } catch (e) {
      setError(e.message ?? e);
    } finally {
      stopLoading();
      toggleLock(false);
    }
  }

  const handleDecrypt = async () => {
    setError('');
    toggleLock(true);
    const dechunker = buildDechunker(decrypt);
    try {
      setLoading('Decrypting...');
      const decrypted = await dechunker(encryptedChunks, privateKey);
      setDecrypted(true);
      updateText('Downloading...');
      download(decrypted);
    } catch (e) {
      setError(e.message ?? e);
    } finally {
      stopLoading();
      toggleLock(false);
    }
  };

  const handleUseStored = () => {
    const storedId = localStorage.getItem('backupId');
    const storedPrivateKey = localStorage.getItem('privateKey');
    if (storedId && storedPrivateKey) {
      setId(storedId);
      setPrivateKey(storedPrivateKey);
    } else {
      setError('No privateKey found');
    }
  };

  return (
    <div className={classes.upload}>
      <button
        className={classes.useStoredButton}
        onClick={handleUseStored}
      >
        Use saved
      </button>
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
        {(
          <button
            className={classes.uploadButton}
            onClick={handleSubmit}
            disabled={!Boolean(id)}
          >
            <CloudDownload/>
          </button>
        )}
      </form>
      {(encryptedChunks && !decrypted) && (<TextArea
        classes={classes}
        id={'private-key-textarea'}
        value={privateKey}
        onChange={e => setPrivateKey(e.target.value)}
        label={'Private Key'}
        inputProps={{ rows: 5 }}
      />)}
      {encryptedChunks && (decrypted ? (
        <span className={classes.decryptionSuccess}>Decrypted and downloaded!</span>
      ) : (
        <button
          className={classes.storeButton}
          onClick={handleDecrypt}
          disabled={!Boolean(privateKey)}
        >
          Decrypt
        </button>
      ))}
      {error && <span className={classes.errorMessage}>{error}</span>}
    </div>
  );
};

export default Retrieve;
