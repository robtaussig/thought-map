import React, { FC, useState, Fragment, useCallback, useRef } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Close from '@material-ui/icons/Close';
import CircleButton from '../../../components/General/CircleButton';
import CheckBox from '../../../components/General/CheckBox';
import classNames from 'classnames';
import { useLoadedDB } from '../../../hooks/useDB';
import useModal from '../../../hooks/useModal';
import { SettingState } from '../../../types';
import { settings as settingsActions } from '../../../actions';
import SetupBackup from '../components/Backup/components/SetupBackup';

interface AppConfigurationProps {
  classes: any;
  settings: SettingState;
}

enum Side {
  TOP = 'left',
  MIDDLE = 'middle',
}

const styles = (theme: any): StyleRules => ({
  container: () => ({
    position: 'fixed',
    height: '100%',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: theme.useDarkMode ? '#2f2f2f' : theme.palette.background[500],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.2s ease-out',
    zIndex: 100,
    '&.hidden': {
      '& #submit': {
        display: 'none',
      }
    }
  }),
  header: () => ({
    flex: '0 0 80px',
    backgroundColor: theme.palette.primary[500],
    boxShadow: `0px 0px 5px 0px black`,
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontSize: 24,
  }),
  button: () => ({
    border: `2px solid ${theme.palette.secondary[0]}`,
    padding: '3px 0',
    marginTop: 40,
    width: '70%',
    borderRadius: '3px',
    backgroundColor: theme.palette.secondary[500],
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
    }
  }),
  circleButton: () => ({
    ...theme.defaults.circleButton,
    backgroundColor: theme.useDarkMode ? 'black' : theme.palette.background[600],
    '&#submit': {
      right: 10,
      bottom: 10,
    },
  }),
  checkboxLabel: () => ({
    marginTop: 40,
    width: '70%',
    padding: '3px 0',
    display: 'flex',
    alignItems: 'center',
    height: 30,
    color: theme.palette.background[0],
    '& > input': {
      marginRight: 5,
    }
  }),
});

export const AppConfiguration: FC<AppConfigurationProps> = ({ classes, settings }) => {
  const [side, setSide] = useState<Side>(Side.TOP);
  const rootRef = useRef(null);
  const db = useLoadedDB();
  const [openModal, closeModal] = useModal();
  const handleClickClose = useCallback(() => {
    setSide(Side.TOP);
  }, []);

  const handleChangeDisableTips = useCallback(e => {
    settingsActions.editSetting(db, {
      field: 'disableTips',
      value: e.target.checked,
    });
  }, []);

  const handleChangeReportBugs = useCallback(e => {
    settingsActions.editSetting(db, {
      field: 'reportBugs',
      value: e.target.checked,
    });
  }, []);

  const handleChangeUseAutoSuggest = useCallback(e => {
    settingsActions.editSetting(db, {
      field: 'useAutoSuggest',
      value: e.target.checked,
    });
  }, []);

  const handleChangeAutoCreateCalendarEvent = useCallback(e => {
    settingsActions.editSetting(db, {
      field: 'autoCreateCalendarEvent',
      value: e.target.checked,
    });
  }, []);

  const handleChangeUsePushNotifications = useCallback(e => {
    if (e.target.checked) {
      Notification.requestPermission(function (status) {
        if (status === 'granted') {
          settingsActions.editSetting(db, {
            field: 'usePushNotifications',
            value: true,
          });
        } else {
          alert('If you would like to use push notifications in the future, you will need to manually grant permission.');
        }
      });
    } else {
      settingsActions.editSetting(db, {
        field: 'usePushNotifications',
        value: e.target.checked,
      });
    }
  }, []);

  const handleChangeUseLocation = useCallback(e => {
    settingsActions.editSetting(db, {
      field: 'useLocation',
      value: e.target.checked,
    });
    if (e.target.checked) {
      navigator.geolocation.getCurrentPosition(() => {
        console.log('Location enabled');
      }, () => {
        settingsActions.editSetting(db, {
          field: 'useLocation',
          value: false,
        });
      });
    }
  }, []);

  const handleChangeUseAutomaticBackups = useCallback(e => {
    settingsActions.editSetting(db, {
      field: 'enableBackupOnDemand',
      value: e.target.checked,
    });
    
    if (e.target.checked && !localStorage.getItem('backupId')) {
      openModal(<SetupBackup onClose={closeModal}/>,'Set up backups')
    }
  }, []);

  const disableTips = Boolean(settings && settings.disableTips);
  const reportBugs = Boolean(settings && settings.reportBugs);
  const useAutoSuggest = Boolean(settings && settings.useAutoSuggest);
  const useLocation = Boolean(settings && settings.useLocation);
  const usePushNotifications = Boolean(settings && settings.usePushNotifications);
  const autoCreateCalendarEvent = Boolean(settings && settings.autoCreateCalendarEvent);
  const enableBackupOnDemand = Boolean(settings && settings.enableBackupOnDemand);

  return (
    <Fragment>
      <button className={classes.button} onClick={() => setSide(Side.MIDDLE)}>
        App Configuration
      </button>
      <div ref={rootRef} className={classNames(classes.container, {
        visible: side === Side.MIDDLE,
        hidden: side === Side.TOP
      })} style={{
        top: side === Side.TOP ? '100%' : 0,
      }}>
        <h1 className={classes.header}>App Configuration</h1>
        <CheckBox
          classes={classes}
          value={'Disable Tips'}
          label={'Disable Tips'}
          isChecked={disableTips}
          onChange={handleChangeDisableTips}
          tooltip={'By default, you will periodically receive context-based suggestions pointing to available features'}
        />
        <CheckBox
          classes={classes}
          value={'Report Bugs'}
          label={'Report Bugs'}
          isChecked={reportBugs}
          onChange={handleChangeReportBugs}
          tooltip={'Agree to automatically submit bug reports on caught errors that will help the developers patch any related issues on future releases.'}
        />
        <CheckBox
          classes={classes}
          value={'Use AutoSuggest'}
          label={'Use AutoSuggest'}
          isChecked={useAutoSuggest}
          onChange={handleChangeUseAutoSuggest}
          tooltip={'If enabled, certain inputs will produce suggestions that draw from previous entries. Suggestions will be a combination of word completions and word sequences, and will be displayed as an overlay. This is different from any browser/device-based auto-suggestions which don\'t necessarily consider context.'}
        />
        <CheckBox
          classes={classes}
          value={'Automatically create calendar events'}
          label={'Automatically create calendar events'}
          isChecked={autoCreateCalendarEvent}
          onChange={handleChangeAutoCreateCalendarEvent}
          tooltip={'If enabled, calendar events will be created automatically whenever a thought\'s date/time is modified'}
        />
        <CheckBox
          classes={classes}
          value={'Enable Push Notifications'}
          label={'Enable Push Notifications'}
          isChecked={usePushNotifications}
          onChange={handleChangeUsePushNotifications}
          tooltip={'In order to use reminders and other related features, push notifications must be enabled'}
        />
        <CheckBox
          classes={classes}
          value={'Automatically back up data'}
          label={'Automatically back up data'}
          isChecked={enableBackupOnDemand}
          onChange={handleChangeUseAutomaticBackups}
          tooltip={'Update remote backup every 24 hours'}
        />
        {'geolocation' in navigator && <CheckBox
          classes={classes}
          value={'Use Location'}
          label={'Use Location'}
          isChecked={useLocation}
          onChange={handleChangeUseLocation}
          tooltip={'If enabled, and permission to use geolocation granted, your location will be saved along with updates to thought statuses. This will allow for a more comprehensive context behind thought transitions.'}
        />}
        <CircleButton classes={classes} id={'submit'} onClick={handleClickClose} label={'Submit'} Icon={Close} />
      </div>
    </Fragment>
  );
};

export default withStyles(styles)(AppConfiguration);
