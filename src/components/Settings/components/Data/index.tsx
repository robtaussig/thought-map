import React, { FC, useState, Fragment, useCallback, useRef, useEffect } from 'react';
import Close from '@material-ui/icons/Close';
import CircleButton from '../../../../components/General/CircleButton';
import CheckBox from '../../../../components/General/CheckBox';
import Diagnosis from '../diagnosis';
import SetupBackup from '../SetupBackup';
import { useDispatch, useSelector } from 'react-redux';
import { RxDatabase } from 'rxdb';
import { openConfirmation } from '../../../../lib/util';
import classNames from 'classnames';
import { useLoadedDB } from '../../../../hooks/useDB';
import useApp from '../../../../hooks/useApp';
import { useModal } from '../../../../hooks/useModal';
import Tooltip from '../../../General/Tooltip';
import { settingSelector } from '../../../../reducers/settings';
import { settings as settingActions } from '../../../../actions';
import {
  DataProps,
  Side,
  ChunkItem,
  ChunkDetails,
  Chunks,
  DiagnosisChunks,
} from '../../types';
import { useStyles } from './styles';
import {
  RELOAD_BEFORE_IMPORT_TEXT,
  CONTINUE_DELETE_TEXT,
  DIAGNOSIS_TOOLTIP_TEXT,
  DELETE_DATA_TOOLTIP,
  CREATE_BACKUP_TOOLTIP_TEXT,
} from './constants';
import { runDiagnosis } from './util';

export const jsonDump = async (db: RxDatabase): Promise<string> => {
  const json = await db.dump();
  const dataStr = JSON.stringify(json);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  return dataUri;
};

export const download = (data: string, fileName: string = 'data') => {
  const exportFileDefaultName = `${fileName}.json`;
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', data);
  linkElement.setAttribute('download', exportFileDefaultName);
  return linkElement.click();
}

export const Data: FC<DataProps> = ({ setLoading }) => {
  const importJSONRef = useRef<HTMLInputElement>(null);
  const [side, setSide] = useState<Side>(Side.TOP);
  const { history } = useApp();
  const classes = useStyles({});
  const dispatch = useDispatch();
  const settings = useSelector(settingSelector);
  const rootRef = useRef(null);
  const [openModal, closeModal] = useModal();
  const { db, initialize } = useLoadedDB();
  const handleClickClose = useCallback(() => {
    setSide(Side.TOP);
  }, []);

  const handleClickExportDataJSON = useCallback(async () => {
    const data = await jsonDump(db);
    download(data);
    return data;
  }, []);

  const handleClickRunDiagnosis = useCallback(async () => {
    const results = await runDiagnosis(db);
    let diagnosisChunks: DiagnosisChunks = {};
    results.forEach(({ action, furtherDetails, table, affectedItems, title, solution }) => {
      diagnosisChunks[action] = diagnosisChunks[action] || {} as Chunks;
      diagnosisChunks[action][title] = diagnosisChunks[action][title] || {
        furtherDetails,
        items: [],
      } as ChunkDetails;
      diagnosisChunks[action][title].items =
        diagnosisChunks[action][title].items.concat(affectedItems.map<ChunkItem>(item => ({ item, table, solution })));
    });
    openModal(<Diagnosis diagnosisChunks={diagnosisChunks} onFix={closeModal} />);
  }, []);

  const handleClickCreateBackup = useCallback(async () => {
    let closeLock = false;
    openModal(
      <SetupBackup onClose={closeModal}/>,
      'Backup',
      { afterClose: () => closeLock }
    );
  }, []);

  const handleClickManageBackups = useCallback(() => {
    history.push('/backups');
  }, []);

  useEffect(() => {
    const handleChange: EventListener = event => {
      const fr = new FileReader();

      fr.onload = e => {
        const json = JSON.parse((e.target as any).result);

        const importJSON = async () => {
          (window as any).blockDBSubscriptions = true;
          if (settings.disableBackupOnImport !== true) {
            await handleClickExportDataJSON();
          }
          setLoading();
          dispatch({ type: 'RESET' });
          await db.remove();
          const newDb = await initialize();
          await newDb.importDump(json);
          location.href = '/';
        };

        importJSON().catch((e) => {
          alert(e);
        });
      };

      fr.readAsText((event.target as any).files[0]);
    };

    importJSONRef.current.addEventListener('change', handleChange);
  }, [settings.disableBackupOnImport]);

  const handleClickDeleteDatabase = () => {
    const onConfirm = async () => {
      setLoading();
      await handleClickExportDataJSON();
      await db.remove();
      location.href = '/settings';
    };

    const onReject = async () => {
      setLoading();
      await db.remove();
      location.href = '/settings';
    };

    const onContinue = () => {
      openConfirmation(RELOAD_BEFORE_IMPORT_TEXT, onConfirm, onReject);
    };

    openConfirmation(CONTINUE_DELETE_TEXT, onContinue);
  };

  const handleCheckAutoBackupOnImport = (e: any) => {
    settingActions.createSetting(db, {
      field: 'disableBackupOnImport',
      value: !e.target.checked,
    });
  };

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
        <CheckBox
          classes={classes}
          value={'Create backup before importing'}
          label={'Create backup before importing'}
          isChecked={!settings.disableBackupOnImport}
          onChange={handleCheckAutoBackupOnImport}
          tooltip={'Importing data will overwrite all current data'}
        />
        <label className={classes.uploadInput}>
          <span>Import Data from JSON</span>
          <input ref={importJSONRef} type="file" accept="json/*" id="file-input" />
        </label>        
        <div className={classes.buttonWrapper}>
          <button className={classes.tooltipButton} onClick={handleClickDeleteDatabase}>Delete Data</button>
          <Tooltip className={'tooltip'} text={DELETE_DATA_TOOLTIP} />
        </div>
        <button className={classes.button} onClick={handleClickExportDataJSON}>Export Data to JSON</button>
        <div className={classes.buttonWrapper}>
          <button className={classes.tooltipButton} onClick={handleClickRunDiagnosis}>Run diagnosis</button>
          <Tooltip className={'tooltip'} text={DIAGNOSIS_TOOLTIP_TEXT} />
        </div>
        <div className={classes.buttonWrapper}>
          <button className={classes.tooltipButton} onClick={handleClickCreateBackup}>Create/Restore Backup</button>
          <Tooltip className={'tooltip'} text={CREATE_BACKUP_TOOLTIP_TEXT} />
        </div>
        <div className={classes.buttonWrapper}>
          <button className={classes.tooltipButton} onClick={handleClickManageBackups}>Manage Backups</button>
        </div>
        <CircleButton classes={classes} id={'submit'} onClick={handleClickClose} label={'Submit'} Icon={Close} />
      </div>
    </Fragment>
  );
};

export default Data;
