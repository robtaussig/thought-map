import React, { FC, useState } from 'react';
import useCrypto from '../../../../hooks/useCrypto';
import { useLoadedDB } from '../../../../hooks/useDB';
import { jsonDump, download } from '../data';
import { chunkData, rebuildResponse } from './util';
import uuidv4 from 'uuid/v4';
import { CHUNK_LENGTH } from './constants';
import { useStyles } from './styles';
import { uploadChunk, fetchBackup } from './api';

interface BackupProps {

}

export const Backup: FC<BackupProps> = () => {
  const classes = useStyles({});
  const { encrypt, decrypt, generatePrivateKey } = useCrypto();
  const db = useLoadedDB();
  const [copied, setCopied] = useState<boolean>(false);
  const [inputtedUuid, setInputtedUuid] = useState<string>('');
  const [textareaInput, setTextareaInput] = useState<string>('');
  const [encrypted, setEncrypted] = useState<ArrayBuffer[]>([new ArrayBuffer(8)]);
  const [privateKey, setPrivateKey] = useState<string>('');

  const handleEncrypt = async () => {
    const data = await jsonDump(db);
    const NUM_CHUNKS = Math.ceil(data.length / CHUNK_LENGTH);
    const chunks = chunkData(data, NUM_CHUNKS);
    const key = await generatePrivateKey();
    const encryptedChunks = await Promise.all(chunks.map(chunk => encrypt(chunk, key)));
    setEncrypted(encryptedChunks);
    setPrivateKey(key);
    setCopied(false);
  };

  const handleClickPrivateKey = (e: any) => {
    navigator.clipboard.writeText(privateKey);
    setCopied(true);
  }

  const handleUpload = async () => {
    const uuid = uuidv4();

    await Promise.all(encrypted.map((chunk, idx) => uploadChunk(chunk, idx, uuid)))

    setInputtedUuid(uuid);
  };

  const retrieveBackup = async () => {
    try {
      const response = await fetchBackup(inputtedUuid);
      const responseBuilder = rebuildResponse(decrypt);
      const decrypted = await responseBuilder(response, textareaInput);
      download(decrypted);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={classes.root}>
      <button onClick={handleEncrypt}>Encrypt</button>
      <div>
        Private Key:
      </div>
      <div style={{ userSelect: 'all' }} onClick={handleClickPrivateKey}>
        {privateKey.split('\n').map((line, idx) => <div key={`${idx}-key`}>{line}</div>)}
      </div>
      {copied && (
        <div>
          Copied!
        </div>
      )}
      {copied && (
        <button onClick={handleUpload}>
          Upload
        </button>
      )}
      <label>
        UniqueId
        <input type={'text'} value={inputtedUuid} onChange={e => setInputtedUuid(e.target.value)} />
      </label>
      <button onClick={retrieveBackup}>
        Retrieve
      </button>
      <textarea value={textareaInput} onChange={e => setTextareaInput(e.target.value)} />
    </div>
  );
};

export default Backup;
