import React, { FC } from 'react';
import { useStyles } from './styles';
import { useSelector } from 'react-redux';
import { backupSelector } from '../../reducers/backups';

interface BackupsProps {
  
}

export const Backups: FC<BackupsProps> = () => {
  const classes = useStyles({});
  const backups = useSelector(backupSelector);

  return (
    <div className={classes.root}>
      <h1 className={classes.header}>Backups (In Development)</h1>
      {backups.map(backup => {
        return (
          <div className={classes.backup}>
            {backup.backupId}
          </div>
        );
      })}
    </div>
  );
};

export default Backups;
