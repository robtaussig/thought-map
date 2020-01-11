import React, { FC, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/styles';
import ManagePhotos from './manage-photos';
import CustomObjects from './custom-objects';
import AppConfiguration from './app-configuration';
import Theme from './theme';
import Data from './data';
import { CACHE } from '../../../public/sw';
import { useLoadingOverlay } from '../../../hooks/useLoadingOverlay';
import { useSelector } from 'react-redux';
import { pictureSelector } from '../../../reducers/pictures';
import { settingSelector } from '../../../reducers/settings';
import {
  CustomTheme,
  customThemeSelector,
} from '../../../reducers/customTheme';

const LOCAL_STORAGE_UPDATE_CHECK_COUNT_KEY = 'updateCheckCount';
const LOCAL_STORAGE_LAST_VERSION_KEY = 'lastVersion';

interface AppSettingsProps {
  setLastNotification: (notification: { message: string }) => void;
}

const useStyles = makeStyles<CustomTheme>((theme: CustomTheme) => ({
  root: () => ({
    position: 'relative',
    backgroundColor: theme.useDarkMode ? '#2f2f2f' : theme.palette.background[700],
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as any,
    alignItems: 'center',
    overflow: 'auto',
  }),
  updateButton: () => ({
    border: `2px solid ${theme.palette.background[0]}`,
    padding: '3px 0',
    marginTop: 40,
    width: '70%',
    borderRadius: '3px',
    backgroundColor: theme.palette.background[500],
    color: theme.palette.background[0],
    '&:active': {
      backgroundColor: theme.palette.background[700],
      boxShadow: 'none!important',
    },
    '&:disabled': {
      backgroundColor: theme.palette.background[300],
      color: theme.palette.background[0],
    },
    '&:not(:disabled)': {
      boxShadow: `0px 0px 5px 2px black`,
    },
  }),
}));

export const AppSettings: FC<AppSettingsProps> = ({ setLastNotification }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [setLoading, stopLoading] = useLoadingOverlay(rootRef);
  const pictures = useSelector(pictureSelector);
  const settings = useSelector(settingSelector);
  const customTheme = useSelector(customThemeSelector);
  const classes = useStyles(customTheme);
  const handleCheckUpdates = () => {
    caches.delete(CACHE);
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
    <div ref={rootRef} className={classes.root}>
      <ManagePhotos pictures={pictures} />
      <Theme />
      <AppConfiguration settings={settings} />
      <Data setLoading={setLoading} />
      <CustomObjects settings={settings} />
      <button className={classes.updateButton} onClick={handleCheckUpdates}>Check for Update (Current: {(window as any).APP_VERSION})</button>
    </div>
  );
};

export default AppSettings;
