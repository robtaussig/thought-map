import React, { FC, useState, MutableRefObject } from 'react';
import Input from '../../../../General/Input';
import classNames from 'classnames';
import { useLoadingOverlay } from '../../../../../hooks/useLoadingOverlay';
import useCrypto from '../../../../../hooks/useCrypto';
import { useLoadedDB } from '../../../../../hooks/useDB';
import { jsonDump } from '../../data';
import { chunkData } from '../util';
import { CHUNK_LENGTH } from '../constants';
import { uploadChunk } from '../api';
import Check from '@material-ui/icons/Check';
import CloudUpload from '@material-ui/icons/CloudUpload';

interface UploadProps {
  classes: any;
  rootRef: MutableRefObject<HTMLDivElement>;
}

export const Upload: FC<UploadProps> = ({ classes, rootRef }) => {
  const [id, setId] = useState<string>('');
  const [setLoading, stopLoading, updateText] = useLoadingOverlay(rootRef);
  const [privateKey, setPrivateKey] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [stored, setStored] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const db = useLoadedDB();
  const { encrypt, generatePrivateKey } = useCrypto();

  const handleSubmit = async (e: any) => {
    setError('');
    e.preventDefault();
    if (!id || privateKey) return;
    setLoading('Exporting Data...');
    const data = await jsonDump(db);
    const NUM_CHUNKS = Math.ceil(data.length / CHUNK_LENGTH);
    const chunks = chunkData(data, NUM_CHUNKS);
    const key = await generatePrivateKey();
    updateText('Encrypting Data...');
    const encryptedChunks = await Promise.all(chunks.map(chunk => encrypt(chunk, key)));
    setCopied(false);
    try {
      updateText('Uploading Data...');
      const responses = await Promise.all(encryptedChunks.map((chunk, idx) => uploadChunk(chunk, idx, id, password)))
      if (responses.some(response => response instanceof Error)) {
        setError(responses.find(response => response instanceof Error).message);
      } else {
        setPrivateKey(key);
      }
    } catch (e) {
      setError(e.message ?? e);
    } finally {
      stopLoading();
    }
  }

  const handleClickPrivateKey = (e: any) => {
    navigator.clipboard.writeText(privateKey);
    setCopied(true);
  };

  const handleStore = () => {
    localStorage.setItem('backupId', id);
    localStorage.setItem('privateKey', privateKey);
    localStorage.setItem('password', password);
    setStored(true);
  };

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
        {!privateKey && (
          <button
            className={classes.uploadButton}
            onClick={handleSubmit}
            disabled={!Boolean(id)}
          >
            <CloudUpload/>
          </button>
        )}
        {privateKey && (
          <span className={classes.uploadSuccess}>
            <Check/>
          </span>
        )}
      </form>
      {!copied && privateKey && <span className={classes.copyToClipboardText}>Click to copy:</span>}
      <div className={classNames(classes.privateKey, { copied })} style={{ userSelect: 'all' }} onClick={handleClickPrivateKey}>
        {privateKey.split('\n').map((line, idx) => <div key={`${idx}-key`}>{line}</div>)}
      </div>
      {!stored && privateKey && (
        <button
          className={classes.storeButton}
          onClick={handleStore}
        >
          Save
        </button>
      )}
      {error && <span className={classes.errorMessage}>{error}</span>}
    </div>
  );
};

export default Upload;
