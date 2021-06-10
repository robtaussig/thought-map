import React, { FC, useState, Fragment, useCallback, useRef } from 'react';
import Close from '@material-ui/icons/Close';
import CircleButton from '../../../../components/General/CircleButton';
import CheckBox from '../../../../components/General/CheckBox';
import classNames from 'classnames';
import { useLoadedDB } from '../../../../hooks/useDB';
import useModal from '../../../../hooks/useModal';
import { useSelector } from 'react-redux';
import { SettingState } from '../../../../types';
import { settings as settingsActions } from '../../../../actions';
import SetupBackup from '../../components/SetupBackup';
import { backupSelector } from '../../../../reducers/backups';
import { useStyles } from './style';
import {
  AUTOSUGGEST_TOOLTIP_TEXT,
  DISABLE_TIP_TOOLTIP_TEXT,
  DISABLE_REPORT_BUGS_TOOLTIP_TEXT,
  AUTO_CREATE_CALENDAR_TOOLTIP_TEXT,
  PUSH_NOTIFICATIONS_TOOLTIP_TEXT,
  DIRECT_PUSH_TOOLTIP_TEXT,
  LOCATION_TOOLTIP_TEXT,
  DISPLAY_ARCHIVED_THOUHGTS_TOOLTIP_TEXT,
} from './constants';
import { Side } from './types';

interface AppConfigurationProps {
  settings: SettingState;
}

export const AppConfiguration: FC<AppConfigurationProps> = ({ settings }) => {
  const classes = useStyles({});
  const [side, setSide] = useState<Side>(Side.TOP);
  const rootRef = useRef(null);
  const { db } = useLoadedDB();
  const backups = useSelector(backupSelector);
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

  const handleChangePropagateUpdates = useCallback(e => {
    settingsActions.editSetting(db, {
      field: 'propagateUpdates',
      value: e.target.checked,
    });
  }, []);

  const handleChangeDisplayArchived = useCallback(async (e) => {
    await settingsActions.editSetting(db, {
      field: 'displayArchived',
      value: e.target.checked,
    });

    location.href = '/';
  }, []);

  const handleChangeUseAutomaticBackups = useCallback(e => {
    settingsActions.editSetting(db, {
      field: 'enableBackupOnDemand',
      value: e.target.checked,
    });

    const hasActiveBackup = Boolean(backups.find(backup => backup.isActive));
    
    if (!hasActiveBackup && e.target.checked) {
      openModal(<SetupBackup onClose={closeModal}/>,'Set Up Backup on Demand')
    }
  }, []);

  const disableTips = Boolean(settings && settings.disableTips);
  const reportBugs = Boolean(settings && settings.reportBugs);
  const displayArchived = Boolean(settings && settings.displayArchived);
  const useAutoSuggest = Boolean(settings && settings.useAutoSuggest);
  const useLocation = Boolean(settings && settings.useLocation);
  const usePushNotifications = Boolean(settings && settings.usePushNotifications);
  const autoCreateCalendarEvent = Boolean(settings && settings.autoCreateCalendarEvent);
  const enableBackupOnDemand = Boolean(settings && settings.enableBackupOnDemand);
  const propagateUpdates = Boolean(settings && settings.propagateUpdates);

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
          tooltip={DISABLE_TIP_TOOLTIP_TEXT}
        />
        <CheckBox
          classes={classes}
          value={'Display Archived Thoughts'}
          label={'Display Archived Thoughts'}
          isChecked={displayArchived}
          onChange={handleChangeDisplayArchived}
          tooltip={DISPLAY_ARCHIVED_THOUHGTS_TOOLTIP_TEXT}
        />
        <CheckBox
          classes={classes}
          value={'Use AutoSuggest'}
          label={'Use AutoSuggest'}
          isChecked={useAutoSuggest}
          onChange={handleChangeUseAutoSuggest}
          tooltip={AUTOSUGGEST_TOOLTIP_TEXT}
        />
        <CheckBox
          classes={classes}
          value={'Automatically create calendar events'}
          label={'Automatically create calendar events'}
          isChecked={autoCreateCalendarEvent}
          onChange={handleChangeAutoCreateCalendarEvent}
          tooltip={AUTO_CREATE_CALENDAR_TOOLTIP_TEXT}
        />
        <CheckBox
          classes={classes}
          value={'Enable Push Notifications'}
          label={'Enable Push Notifications'}
          isChecked={usePushNotifications}
          onChange={handleChangeUsePushNotifications}
          tooltip={PUSH_NOTIFICATIONS_TOOLTIP_TEXT}
        />
        <CheckBox
          classes={classes}
          value={'Enable direct pushing to pool'}
          label={'Enable direct pushing to pool'}
          isChecked={enableBackupOnDemand}
          onChange={handleChangeUseAutomaticBackups}
          tooltip={DIRECT_PUSH_TOOLTIP_TEXT}
        />
        {'geolocation' in navigator && <CheckBox
          classes={classes}
          value={'Use Location'}
          label={'Use Location'}
          isChecked={useLocation}
          onChange={handleChangeUseLocation}
          tooltip={LOCATION_TOOLTIP_TEXT}
        />}
        <CircleButton classes={classes} id={'submit'} onClick={handleClickClose} label={'Submit'} Icon={Close} />
      </div>
    </Fragment>
  );
};

export default AppConfiguration;
