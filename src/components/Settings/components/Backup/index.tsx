import React, { FC, useState } from 'react';
import useCrypto from '../../../../hooks/useCrypto';
import { useLoadedDB } from '../../../../hooks/useDB';
import { jsonDump, download } from '../data';
import { chunkData, rebuildResponse } from './util';
import uuidv4 from 'uuid/v4';
import { CHUNK_LENGTH } from './constants';
import { useStyles } from './styles';
import { uploadChunk, fetchBackup } from './api';
import Nav from './components/Nav';
import Upload from './components/Upload';
import Retrieve from './components/Retrieve';
import Update from './components/Update';
import { NavOptions } from './types';

interface BackupProps {

}

export const Backup: FC<BackupProps> = () => {
  const classes = useStyles({});
  const [currentOption, setCurrentOption] = useState<NavOptions>(null);
  const { encrypt, decrypt, generatePrivateKey } = useCrypto();
  const db = useLoadedDB();
  const [copied, setCopied] = useState<boolean>(false);
  const [inputtedUuid, setInputtedUuid] = useState<string>('');
  const [textareaInput, setTextareaInput] = useState<string>('');
  const [encrypted, setEncrypted] = useState<ArrayBuffer[]>([new ArrayBuffer(8)]);
  const [privateKey, setPrivateKey] = useState<string>('');

  const handleClickPrivateKey = (e: any) => {
    navigator.clipboard.writeText(privateKey);
    setCopied(true);
  }

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
      <Nav
        classes={classes}
        currentOption={currentOption}
        onChange={setCurrentOption}
      />
      {currentOption === NavOptions.Upload && <Upload classes={classes}/>}
      {currentOption === NavOptions.Retrieve && <Retrieve classes={classes}/>}
      {currentOption === NavOptions.Update && <Update classes={classes}/>}
    </div>
  );
};

export default Backup;
