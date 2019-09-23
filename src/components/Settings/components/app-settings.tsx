import React, { FC, useEffect } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Home from '@material-ui/icons/Home';
import CircleButton from '../../General/CircleButton';
import ManagePhotos from './manage-photos';
import CustomObjects from './custom-objects';
import AppConfiguration from './app-configuration';
import Data from './data';
import { AppState } from '../../../reducers';
import useApp from '../../../hooks/useApp';

const LOCAL_STORAGE_UPDATE_CHECK_COUNT_KEY = 'updateCheckCount';
const LOCAL_STORAGE_LAST_VERSION_KEY = 'lastVersion';

interface AppSettingsProps {
  classes: any;
  state: AppState;
  setLastNotification: (notification: { message: string }) => void;
}

const styles = (theme: any): StyleRules => ({
  root: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  circleButton: {
    ...theme.defaults.circleButton,
    '&#return-home': {
      left: 10,
      bottom: 10,
    },
  },
  updateButton: {
    border: '2px solid white',
    padding: '3px 0',
    marginTop: 40,
    width: '70%',
    borderRadius: '3px',
    backgroundColor: theme.palette.gray[500],
    color: 'white',
    '&:active': {
      backgroundColor: theme.palette.gray[700],
      boxShadow: 'none!important',
    },
    '&:disabled': {
      backgroundColor: theme.palette.gray[300],
      color: 'white',
    },
    '&:not(:disabled)': {
      boxShadow: '0px 0px 5px 2px black',
    }
  }
});

export const AppSettings: FC<AppSettingsProps> = ({ classes, state, setLastNotification }) => {
  const { history } = useApp();
  const handleClickReturnHome = () => {
    const nextUrl = location.pathname.replace(/settings.*/, '');
    history.push(nextUrl);
  }
  const handleCheckUpdates = () => {
    localStorage.setItem(LOCAL_STORAGE_LAST_VERSION_KEY, (window as any).APP_VERSION);
    localStorage.setItem(LOCAL_STORAGE_UPDATE_CHECK_COUNT_KEY, '1');
    location.reload();
  };

  useEffect(() => {
    if (localStorage.getItem(LOCAL_STORAGE_UPDATE_CHECK_COUNT_KEY) === '1') {
      localStorage.setItem(LOCAL_STORAGE_UPDATE_CHECK_COUNT_KEY, '2');
      location.reload();
    } else if (localStorage.getItem(LOCAL_STORAGE_UPDATE_CHECK_COUNT_KEY) === '2') {
      localStorage.setItem(LOCAL_STORAGE_UPDATE_CHECK_COUNT_KEY, '0');
      if (localStorage.getItem(LOCAL_STORAGE_LAST_VERSION_KEY) === (window as any).APP_VERSION) {
        setLastNotification({ message: 'The application is already up to date.' });
      } else {
        setLastNotification({ message: `Update successful. Updated from ${localStorage.getItem(LOCAL_STORAGE_LAST_VERSION_KEY)} to ${(window as any).APP_VERSION}` });
      }
    }
  }, []);

  return (
    <div className={classes.root}>
      <ManagePhotos pictures={state.pictures}/>
      <AppConfiguration settings={state.settings}/>
      <Data state={state}/>
      <CustomObjects settings={state.settings}/>
      <button className={classes.updateButton} onClick={handleCheckUpdates}>Check for Update (Current: {(window as any).APP_VERSION})</button>
      <CircleButton
        classes={classes}
        id={'return-home'}
        onClick={handleClickReturnHome}
        label={'Return Home'}
        Icon={Home}
      />
    </div>
  );
};

export default withStyles(styles)(AppSettings);
