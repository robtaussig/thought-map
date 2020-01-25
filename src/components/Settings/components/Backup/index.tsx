import React, { FC, useState, useRef } from 'react';
import { useStyles } from './styles';
import Nav from './components/Nav';
import Upload from './components/Upload';
import Retrieve from './components/Retrieve';
import Update from './components/Update';
import { NavOptions } from './types';

interface BackupProps {

}

export const Backup: FC<BackupProps> = () => {
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
      {currentOption === NavOptions.Upload && <Upload rootRef={rootRef} classes={classes}/>}
      {currentOption === NavOptions.Retrieve && <Retrieve rootRef={rootRef} classes={classes}/>}
      {currentOption === NavOptions.Update && <Update rootRef={rootRef} classes={classes}/>}
    </div>
  );
};

export default Backup;
