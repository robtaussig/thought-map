import React, { FC, useState, Fragment, useCallback, useRef } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Close from '@material-ui/icons/Close';
import CircleButton from '../../../components/General/CircleButton';
import CheckBox from '../../../components/General/CheckBox';
import classNames from 'classnames';
import { useLoadedDB } from '../../../hooks/useDB';
import { SettingState } from '../../../types';
import { settings as settingsActions } from '../../../actions';

interface AppConfigurationProps {
  classes: any,
  settings: SettingState,
}

enum Side {
  TOP = 'left',
  MIDDLE = 'middle',
}

const styles = (theme: any): StyleRules => ({
  container: {
    position: 'fixed',
    height: '100vh',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#545454',
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
  },
  header: {
    flex: '0 0 80px',
    backgroundColor: theme.palette.primary[500],
    boxShadow: '0px 0px 5px 0px black',
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontSize: 24,
  },
  button: {
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
  },
  circleButton: {
    ...theme.defaults.circleButton,
    '&#submit': {
      right: 10,
      bottom: 10,
    },
  },
  checkboxLabel: {
    marginTop: 40,
    width: '70%',
    padding: '3px 0',
    display: 'flex',
    alignItems: 'center',
    height: 30,
    color: 'white',
    '& > input': {
      marginRight: 5,
    }
  },
});

export const AppConfiguration: FC<AppConfigurationProps> = ({ classes, settings }) => {
  const [side, setSide] = useState<Side>(Side.TOP);

  const rootRef = useRef(null);
  const db = useLoadedDB();
  const handleClickClose = useCallback(() => {
    setSide(Side.TOP);
  }, []);

  const handleClickButton = useCallback(() => {
    alert('Coming soon...')
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

  const reportBugs = Boolean(settings && settings.reportBugs);
  const useAutoSuggest = Boolean(settings && settings.useAutoSuggest);

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
        <button className={classes.button} onClick={handleClickButton}>View all images</button>
        <CheckBox classes={classes} value={'Report Bugs'} label={'Report Bugs'} isChecked={reportBugs} onChange={handleChangeReportBugs}/>
        <CheckBox classes={classes} value={'Use AutoSuggest'} label={'Use AutoSuggest'} isChecked={useAutoSuggest} onChange={handleChangeUseAutoSuggest}/>
        <CircleButton classes={classes} id={'submit'} onClick={handleClickClose} label={'Submit'} Icon={Close}/>
      </div>
    </Fragment>
  );
};

export default withStyles(styles)(AppConfiguration);
