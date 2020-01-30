import React, { FC, useState, useRef } from 'react';
import { useStyles } from './styles';
import Nav from './components/Nav';
import Upload from './components/Upload';
import Retrieve from './components/Retrieve';
import { NavOptions } from './types';

interface BackupProps {
  toggleLock: (lock: boolean) => void;
}

export const Backup: FC<BackupProps> = ({ toggleLock }) => {
  const classes = useStyles({});
  const rootRef = useRef(null);
  const [currentOption, setCurrentOption] = useState<NavOptions>(null);

  return (
    <div ref={rootRef} className={classes.root}>
      <Nav
        classes={classes}
        currentOption={currentOption}
        onChange={setCurrentOption}
      />
      {currentOption === NavOptions.Upload && <Upload rootRef={rootRef} toggleLock={toggleLock} classes={classes}/>}
      {currentOption === NavOptions.Retrieve && <Retrieve rootRef={rootRef} toggleLock={toggleLock} classes={classes}/>}
    </div>
  );
};

export default Backup;
