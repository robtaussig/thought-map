import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import useCrypto from '../../../hooks/useCrypto';
import { ab2str } from '../../../hooks/useCrypto/util';

const useStyles = makeStyles((theme: any) => ({
  root: {

  },
}));

interface BackupProps {

}

export const Backup: FC<BackupProps> = () => {
  const classes = useStyles({});
  const { encrypt, decrypt } = useCrypto();
  const [input, setInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [textareaInput, setTextareaInput] = useState<string>('');
  const [encrypted, setEncrypted] = useState<ArrayBuffer>(new ArrayBuffer(8));
  const [decrypted, setDecrypted] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');

  const handleEncrypt = async () => {
    const [encrypted, privateKey] = await encrypt(input);
    setEncrypted(encrypted);
    setPrivateKey(privateKey);
    setCopied(false);
  };

  const handleDecrypt = async () => {
    const decrypted = await decrypt(encrypted, textareaInput);
    setDecrypted(decrypted);
  };

  const handleClickPrivateKey = (e: any) => {
    navigator.clipboard.writeText(privateKey);
    setCopied(true);
  }

  return (
    <div className={classes.root}>
      <input value={input} onChange={e => setInput(e.target.value)} />
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
      <div>
        Encrypted Data:
      </div>
      <div>
        {ab2str(encrypted)}
      </div>
      <textarea value={textareaInput} onChange={e => setTextareaInput(e.target.value)} />
      <button onClick={handleDecrypt}>Decrypt</button>
      <div>
        {decrypted}
      </div>
    </div>
  );
};

export default Backup;
