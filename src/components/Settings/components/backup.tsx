import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import useCrypto from '../../../hooks/useCrypto';
import { ab2str, str2ab } from '../../../hooks/useCrypto/util';
import { useLoadedDB } from '../../../hooks/useDB';
import { jsonDump, download } from './data';
import uuidv4 from 'uuid/v4';

const useStyles = makeStyles((theme: any) => ({
  root: {

  },
}));

interface BackupProps {

}

const chunkData = (data: string, numChunks: number): string[] => {
  const chunks: string[] = [];
  const chunkLength = Math.floor(data.length / numChunks);
  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkLength;
    const end = start + chunkLength;
    if (i === numChunks - 1) {
      chunks.push(data.slice(start));
    } else {
      chunks.push(data.slice(start, end));
    }
  }
  return chunks;
};

const dechunkData = (chunks: string[]): string => {
  return chunks.reduce((dechunked, chunk) => dechunked + chunk, '');
};

const CHUNK_LENGTH = 30000;

// const API = 'http://localhost:3001';
const API = 'https://robtaussig.com';

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
    const uploadChunk = (chunk: any, partIdx: number): Promise<any> => {
      return fetch(`${API}/thought-map/api/backup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          uuid,
          part: partIdx,
          chunk: ab2str(chunk),
        }),
      });
    };

    await Promise.all(encrypted.map(uploadChunk));
    setInputtedUuid(uuid);
  };

  const retrieveBackup = async () => {
    try {
      const res = await fetch(`${API}/thought-map/api/retrieve-backup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          uuid: inputtedUuid,
        }),
      });
      const jsonRes: {
        chunks: {
          part: number,
          chunk: string,
        }[]
      } = await res.json();

      const final = await Promise.all(
        jsonRes.chunks
          .sort((a, b) => a.part > b.part ? 1 : -1)
          .map(({ chunk }) => {
            return decrypt(str2ab(chunk), textareaInput);
          })
      );

      const decryptedSingle = dechunkData(final);
      download(decryptedSingle);

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
