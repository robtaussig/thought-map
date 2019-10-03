import React, { FC, useState, Fragment, useCallback, useRef, useEffect } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import Close from '@material-ui/icons/Close';
import CircleButton from '../../../components/General/CircleButton';
import Diagnosis from './diagnosis';
import { RxDatabase } from 'rxdb';
import { openConfirmation } from '../../../lib/util';
import classNames from 'classnames';
import { useLoadedDB } from '../../../hooks/useDB';
import useApp from '../../../hooks/useApp';
import { getSearchParam } from '../../../lib/util';
import { useNestedXReducer } from '../../../hooks/useXReducer';
import { useModal } from '../../../hooks/useModal';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { Plan } from '../../../store/rxdb/schemas/plan';
import { Note } from '../../../store/rxdb/schemas/note';
import { Tag } from '../../../store/rxdb/schemas/tag';
import { Picture } from '../../../store/rxdb/schemas/picture';
import { Setting } from '../../../store/rxdb/schemas/setting';
import { Connection } from '../../../store/rxdb/schemas/connection';
import { Status } from '../../../store/rxdb/schemas/status';
import {
  thoughts as thoughtActions,
  plans as planActions,
  connections as connectionActions,
  notes as noteActions,
  tags as tagActions,
  pictures as pictureActions,
  settings as settingActions,
  statuses as statusActions,
} from '../../../actions';
import Tooltip from '../../General/Tooltip';
import {
  DataProps,
  Side,
  OrphanedChildSource,
  OrphanedChildObject,
  InvalidSetting,
  ValidSettings,
  FormattedResultActionEnum,
  FormattedResult,
  ChunkItem,
  ChunkDetails,
  Chunks,
  DiagnosisChunks,
  SolutionTypes,
} from '../types';

const styles = (theme: any): StyleRules => ({
  container: {
    position: 'fixed',
    height: '100%',
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
  buttonWrapper: {
    border: '2px solid white',
    marginTop: 40,
    width: '70%',
    borderRadius: '3px',
    backgroundColor: theme.palette.gray[500],
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    boxShadow: '0px 0px 5px 2px black',
    '& .tooltip': {
      position: 'absolute',
      justifyContent: 'center',
      right: -30,
    }
  },
  tooltipButton: {
    color: 'white',
    padding: '3px 0',
    flex: 1,
    '&:active': {
      backgroundColor: theme.palette.gray[700],
      boxShadow: 'none!important',
    },
    '&:disabled': {
      backgroundColor: theme.palette.gray[300],
      color: 'white',
    },
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

const RELOAD_BEFORE_IMPORT_TEXT = 'Would you like to back up your current data first (cancel will proceed without backup)? The page will reload.';
const CONTINUE_DELETE_TEXT = 'Are you sure you want to delete your data?';
const DIAGNOSIS_TOOLTIP_TEXT = 'Sometimes bugs magically appear and result in corrupted and/or orphaned data, and other unforeseeable consequences. This tool will scan your database and fix these issues automatically if possible and suggest actions where not.';
const DELETE_DATA_TOOLTIP = 'Before you can import data from a JSON file, you must first delete your data. You will be asked whether you want to create a backup before continuing.';

export const jsonDump = async (db: RxDatabase) => {
  const json = await db.dump();
  const dataStr = JSON.stringify(json);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const exportFileDefaultName = 'data.json';
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  return linkElement.click();
};

export const Data: FC<DataProps> = ({ classes, state, setLoading }) => {
  const importJSONRef = useRef<HTMLInputElement>(null);
  const [side, setSide] = useState<Side>(Side.TOP);
  const { dispatch, history } = useApp();
  const readyToImport = getSearchParam(history, 'import');
  const [_notificationDisabled, setNotificationDisabled] = useNestedXReducer('notificationDisabled', state, dispatch);
  const rootRef = useRef(null);
  const [openModal, closeModal] = useModal();
  const db = useLoadedDB();
  const handleClickClose = useCallback(() => {
    setSide(Side.TOP);
  }, []);

  const handleClickExportDataJSON = useCallback(async () => {
    jsonDump(db);
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
    openModal(<Diagnosis diagnosisChunks={diagnosisChunks} onFix={closeModal}/>);
  }, []);

  useEffect(() => {
    const handleChange: EventListener = event => {
      const fr = new FileReader();
    
      fr.onload = e => {
        const json = JSON.parse((e.target as any).result);

        const importJSON = async () => {          
          (window as any).blockDBSubscriptions = true;
          setLoading();
          await db.importDump(json);
          location.href = '/settings';
        };

        importJSON();
      };

      fr.readAsText((event.target as any).files[0]);
    };
  
    if (readyToImport) {
      importJSONRef.current.addEventListener('change', handleChange);
    }
  }, []);

  useEffect(() => {
    if (readyToImport) {
      setSide(Side.MIDDLE);
    }
  }, []);

  const handleClickDeleteDatabase = () => {
    const onConfirm = async () => {
      setLoading();
      await handleClickExportDataJSON();
      await db.remove();
      location.href = '/settings?import=true';
    };

    const onReject = async () => {
      setLoading();
      await db.remove();
      location.href = '/settings?import=true';
    };

    const onContinue = () => {
      openConfirmation(RELOAD_BEFORE_IMPORT_TEXT, onConfirm, onReject);
    };

    openConfirmation(CONTINUE_DELETE_TEXT, onContinue);
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
        {readyToImport ? (<label className={classes.uploadInput}>
          <span>Import Data from JSON</span>
          <input ref={importJSONRef} type="file" accept="json/*" id="file-input"/>
        </label>) : (
          <div className={classes.buttonWrapper}>
            <button className={classes.tooltipButton} onClick={handleClickDeleteDatabase}>Delete Data</button>
            <Tooltip className={'tooltip'} text={DELETE_DATA_TOOLTIP}/>
          </div>
        )}
        <button className={classes.button} onClick={handleClickExportDataJSON}>Export Data to JSON</button>
        <div className={classes.buttonWrapper}>
          <button className={classes.tooltipButton} onClick={handleClickRunDiagnosis}>Run diagnosis</button>
          <Tooltip className={'tooltip'} text={DIAGNOSIS_TOOLTIP_TEXT}/>
        </div>
        <CircleButton classes={classes} id={'submit'} onClick={handleClickClose} label={'Submit'} Icon={Close}/>
      </div>
    </Fragment>
  );
};

const booleanValues = new Set([ true, false ]);

const VALID_SETTINGS: ValidSettings = {
  reportBugs: {
    values: booleanValues,
    reason: 'reportBugs must be a boolean',
  },
  useAutoSuggest: {
    values: booleanValues,
    reason: 'useAutoSuggest must be a boolean',
  },
  customStatuses: {
    values: null,
    reason: 'customStatuses must be an array of strings',
  },
  useLocation: {
    values: booleanValues,
    reason: 'useLocation must be a boolean',
  },
  usePushNotifications: {
    values: booleanValues,
    reason: 'usePushNotifications must be a boolean',
  },
  customTypes: {
    values: null,
    reason: 'customTypes must be an array of strings',
  },
  customTags: {
    values: null,
    reason: 'customTags must be an array of strings',
  },
};

const formatResults = (
  orphanedObjects: OrphanedChildObject[],
  statuslessThoughts: Thought[],
  uncategorizedThoughts: Thought[],
  orphanedThoughts: Thought[],
  brokenConnections: Connection[],
  invalidSettings: InvalidSetting[],
  fatPictures: Picture[],
): FormattedResult[] => {
  const formattedResults: FormattedResult[] = [];

  orphanedObjects.forEach(({ table, item }) => {
    formattedResults.push({
      action: FormattedResultActionEnum.CAN_FIX,
      furtherDetails: 'Several child objects were found without an associated parent. They should be deleted.',
      table,
      affectedItems: [item],
      title: 'Orphaned Item',
      solution: SolutionTypes.DELETE,
    });
  });

  statuslessThoughts.forEach(statuslessThought => {
    formattedResults.push({
      action: FormattedResultActionEnum.CAN_FIX,
      furtherDetails: 'These thoughts do not have an associated status. This might be due to unmigrated data from an older version of the app. At least a new status should be created for each thought.',
      table: 'thought',
      affectedItems: [statuslessThought],
      title: 'Statusless Thought',
      solution: SolutionTypes.CREATE_STATUS
    });
  });

  uncategorizedThoughts.forEach(uncategorizedThought => {
    formattedResults.push({
      action: FormattedResultActionEnum.NOT_BUG,
      furtherDetails: 'Though not an issue, these thoughts are not categorized under a plan.',
      table: 'thought',
      affectedItems: [uncategorizedThought],
      title: 'Uncategorized Thought',
    });
  });

  orphanedThoughts.forEach(orphanedThought => {
    formattedResults.push({
      action: FormattedResultActionEnum.CAN_FIX,
      furtherDetails: 'These thoughts were categorized under a plan that no longer exists. They should be uncategorized.',
      table: 'thought',
      affectedItems: [orphanedThought],
      title: 'Orphaned Thought',
      solution: SolutionTypes.NULL_OUT_PLAN_ID,
    });
  });

  brokenConnections.forEach(brokenConnection => {
    formattedResults.push({
      action: FormattedResultActionEnum.CAN_FIX,
      furtherDetails: 'These connections are no longer attached to two thoughts and should be deleted.',
      table: 'connection',
      affectedItems: [brokenConnection],
      title: 'Broken Connection',
      solution: SolutionTypes.DELETE,
    });
  });

  invalidSettings.forEach(invalidSetting => {
    formattedResults.push({
      action: FormattedResultActionEnum.CAN_FIX,
      furtherDetails: 'These settings are not valid and should be deleted.',
      table: 'setting',
      affectedItems: [invalidSetting],
      title: 'Invalid Setting',
      solution: SolutionTypes.DELETE,
    });
  });

  fatPictures.forEach(fatPicture => {
    formattedResults.push({
      action: FormattedResultActionEnum.CAN_FIX,
      furtherDetails: 'These pictures should be backed up to imgur and contain a valid url, but still have a stored copy in local memory. The local version has been deleted to preserve resources.',
      table: 'picture',
      affectedItems: [fatPicture],
      title: 'Fat Picture',
    });
  });

  return formattedResults;
};

const getOrphanedObjects = (orphanedChildObjectSources: OrphanedChildSource[], thoughtIds: Set<string>): OrphanedChildObject[] => {
   return orphanedChildObjectSources.reduce((results, { table, items }) => {
    items.forEach(item => {
      if (thoughtIds.has(item.thoughtId) === false) {
        results.push({ table, item });
      }
    });
    return results;
  }, [] as OrphanedChildObject[]);
}

const getStatuslessThoughts = (thoughts: Thought[], statuses: Status[]): Thought[] => {
  return thoughts.filter(thought => {
    return statuses.some(status => status.thoughtId === thought.id) === false;
  });
};

const isBrokenConnection = (thoughtIds: Set<string>): (connection: Connection) => boolean => {
  return connection => {
    return !(connection.to &&
      connection.from &&
      thoughtIds.has(connection.from) === true &&
      thoughtIds.has(connection.to) === true);
  };
};

const getInvalidSettings = (settings: Setting[]): InvalidSetting[] => {
   return settings.filter(({ field, value}) => {
    return !(VALID_SETTINGS[field] &&
      (
        VALID_SETTINGS[field].values === null ||
        VALID_SETTINGS[field].values.has(value)
      ));
  })
    .map<InvalidSetting>(({ field, value }) => {
      return {
        field,
        value,
        reason: VALID_SETTINGS[field].reason,
      };
    });
}

const getDBItems = (db: RxDatabase): Promise<[
  Thought[], Connection[], Plan[], Note[], Tag[], Picture[], Setting[], Status[]
]> => {
  return Promise.all([
    thoughtActions.getThoughts(db),
    connectionActions.getConnections(db),
    planActions.getPlans(db),
    noteActions.getNotes(db),
    tagActions.getTags(db),
    pictureActions.getPictures(db),
    settingActions.getSettings(db),
    statusActions.getStatuses(db),
  ]);
};

const runDiagnosis = async (db: RxDatabase) => {
  const [ thoughts, connections, plans, notes, tags, pictures, settings, statuses ] = await getDBItems(db);
  const thoughtIds = new Set<string>(thoughts.map<string>(({ id }) => id));
  const orphanedChildObjectSources: OrphanedChildSource[] = [
    { table: 'note', items: notes },
    { table: 'tag', items: tags },
    { table: 'tag', items: tags },
    { table: 'picture', items: pictures },
    { table: 'status', items: statuses },
  ];

  const orphanedObjects = getOrphanedObjects(orphanedChildObjectSources, thoughtIds);
  const statuslessThoughts = getStatuslessThoughts(thoughts, statuses);
  const uncategorizedThoughts: Thought[] = thoughts.filter(thought => !thought.planId);
  const orphanedThoughts: Thought[] = thoughts.filter(thought => {
    return thought.planId && (plans.some(plan => plan.id === thought.planId) === false);
  });
  const brokenConnections: Connection[] = connections.filter(isBrokenConnection(thoughtIds));
  const invalidSettings = getInvalidSettings(settings);
  //Has both localUrl and imgurUrl
  const fatPictures: Picture[] = pictures.filter(({ imgurUrl, localUrl }) => {
    return imgurUrl && localUrl;
  });

  return formatResults(
    orphanedObjects,
    statuslessThoughts,
    uncategorizedThoughts,
    orphanedThoughts,
    brokenConnections,
    invalidSettings,
    fatPictures,
  );
};

export default withStyles(styles)(Data);
