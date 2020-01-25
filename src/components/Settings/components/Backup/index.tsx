import React, { FC, useState } from 'react';
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
  const [currentOption, setCurrentOption] = useState<NavOptions>(null);

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
