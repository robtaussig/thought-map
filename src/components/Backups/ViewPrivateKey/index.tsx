import React, { FC, useRef, useEffect, useState } from 'react';
import { Backup } from '../../../store/rxdb/schemas/backup';
import QRCode from 'qrcode';
import { useStyles } from './style';

interface ViewPrivateKeyProps {
  backup: Backup;
}

export const ViewPrivateKey: FC<ViewPrivateKeyProps> = ({ backup }) => {
  const classes = useStyles({});
  const [revealText, setRevealText] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (backup) {
      QRCode.toCanvas(canvasRef.current, backup.privateKey, function (error) {
        if (error) console.error(error);
      });
    }
  }, [backup]);

  const handleClickReveal = () => {
    setRevealText(prev => !prev);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(backup.privateKey);
    setCopied(true);
  };

  return (
    <div className={classes.root}>
      <canvas
        className={classes.canvas}
        ref={canvasRef}
        height={'200px'}
        width={'200px'}
      />
      <button
        className={classes.copyButton}
        onClick={handleCopyToClipboard}  
      >
        {copied ? 'Copied' : 'To Clipboard'}
      </button>
      <button
        className={classes.revealTextButton}
        onClick={handleClickReveal}
      >
        {revealText ? 'Hide Text' : 'Reveal Text'}
      </button>
      {revealText && (
        <span
          className={classes.privateKeyText}
        >
          {backup.privateKey}
        </span>
      )}
    </div>
  );
};

export default ViewPrivateKey;
