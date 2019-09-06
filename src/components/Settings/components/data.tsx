import React, { FC, useState, Fragment, useCallback, useRef, useEffect } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Close from '@material-ui/icons/Close';
import CircleButton from '../../../components/General/CircleButton';
import CheckBox from '../../../components/General/CheckBox';
import { openConfirmation } from '../../../lib/util';
import classNames from 'classnames';
import { useLoadedDB } from '../../../hooks/useDB';
import { SettingState } from '../../../types';
import { settings as settingsActions } from '../../../actions';

interface DataProps {
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
  uploadInput: {
    display: 'flex',
    justifyContent: 'center',
    border: '2px solid white',
    padding: '3px 0',
    marginTop: 40,
    width: '70%',
    borderRadius: '3px',
    backgroundColor: theme.palette.gray[500],
    color: 'white',
    boxShadow: '0px 0px 5px 2px black',
    '& > input': {
      display: 'none',
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

export const Data: FC<DataProps> = ({ classes, settings }) => {
  const importJSONRef = useRef<HTMLInputElement>(null);
  const [side, setSide] = useState<Side>(Side.TOP);

  const rootRef = useRef(null);
  const db = useLoadedDB();
  const handleClickClose = useCallback(() => {
    setSide(Side.TOP);
  }, []);

  const handleClickExportDataJSON = useCallback(async () => {
    const json = await db.dump();
    const dataStr = JSON.stringify(json);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    return linkElement.click();
  }, []);

  useEffect(() => {
    const handleChange: EventListener = event => {
      const fr = new FileReader();
    
      fr.onload = e => {
        const json = JSON.parse((e.target as any).result);
        
        const importJSON = async () => {
          try {
            await db.importDump(json);
          } catch(e) {
            const onConfirm = async () => {
              await handleClickExportDataJSON();
              await db.remove();
              location.reload();
            };

            const onReject = async () => {
              await db.remove();
              location.reload();
            };

            openConfirmation('You must clear your data and reload the app before importing from JSON. Would you like to back up your current data first?', onConfirm, onReject);
          }
        };

        openConfirmation('Are you sure you want to import new data from a JSON file?', importJSON);
      };

      fr.readAsText((event.target as any).files[0]);
    };
  
    importJSONRef.current.addEventListener('change', handleChange);
  }, []);

  return (
    <Fragment>
      <button className={classes.button} onClick={() => setSide(Side.MIDDLE)}>
        Data
      </button>
      <div ref={rootRef} className={classNames(classes.container, {
        visible: side === Side.MIDDLE,
        hidden: side === Side.TOP
      })} style={{
        top: side === Side.TOP ? '100%' : 0,
      }}>
        <h1 className={classes.header}>Data</h1>
        <button className={classes.button} onClick={handleClickExportDataJSON}>Export Data to JSON</button>
        <label className={classes.uploadInput}>
          <span>Import Data from JSON</span>
          <input ref={importJSONRef} type="file" accept="json/*" id="file-input"/>
        </label>
        <CircleButton classes={classes} id={'submit'} onClick={handleClickClose} label={'Submit'} Icon={Close}/>
      </div>
    </Fragment>
  );
};

export default withStyles(styles)(Data);
