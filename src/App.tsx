import React, { FC, useEffect, useMemo, useRef, useState, Dispatch, SetStateAction, useCallback } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { styles } from './App.style';
import { appReducer, DEFAULT_STATE } from './reducers';
import { Context } from './store';
import { sortByIndexThenDate } from './models/base';
import { ACTION_TYPES } from './reducers';
import { intoMap, convertSettings, thoughtStatuses } from './lib/util';
import {
  Thought as ThoughtType,
  Plan as PlanType,
  Note as NoteType,
  Tag as TagType,
  Connection as ConnectionType,
  Template as TemplateType,
  Picture as PictureType,
  Setting as SettingType,
  Status as StatusType,
} from './store/rxdb/schemas/types';
import useXReducer, { useNestedXReducer, Action, Setter } from './hooks/useXReducer';
import { useDB } from './hooks/useDB';
import { RxDatabase } from 'rxdb';
import {
  thoughts as thoughtActions,
  plans as planActions,
  connections as connectionActions,
  notes as noteActions,
  tags as tagActions,
  templates as templateActions,
  pictures as pictureActions,
  settings as settingActions,
  statuses as statusActions,
} from './actions';
import Home from './components/Home';
import PriorityList from './components/Home/PriorityList';
import Settings from './components/Settings';
import CreateThought from './components/CreateThought';
import Thought from './components/Thought';
import Notifications from './components/Notifications';
import { ModalProvider } from './hooks/useModal';
import Div100vh from 'react-div-100vh';
import {
  AppProps,
  Notification,
  Setters,
  RxChangeEvent,
  ConnectionState,
  ThoughtState,
  PlanState,
  NoteState,
  TagState,
  TemplateState,
  PictureState,
  SettingState,
  StatusState,
  StatusesByThought,
} from './types';

export const STATUS_OPTIONS: string[] = ['new', 'in progress', 'almost done', 'completed'];

const matchStatusLocationIfEnabled = (db: RxDatabase) => async (status: StatusType): Promise<void> => {
  const [useLocation] = await settingActions.findSetting(db, 'field', 'useLocation');
  if (useLocation && useLocation.value === true) {
    navigator.geolocation.getCurrentPosition(position => {
      if (position && position.coords) {
        const locationValue = `${position.coords.latitude},${position.coords.longitude}`;
        const nextStatus = {
          ...status,
          location: locationValue,
        };
        statusActions.editStatus(db, nextStatus);
      }
    });
  }
};

const App: FC<AppProps> = ({ classes, history }) => {
  const [state, dispatch] = useXReducer(DEFAULT_STATE, appReducer);
  const [lastNotification, setLastNotification] = useState<Notification>(null);
  const [_thoughts, setThoughts] = useNestedXReducer('thoughts', state, dispatch);
  const [_connections, setConnections] = useNestedXReducer('connections', state, dispatch);
  const [_notes, setNotes] = useNestedXReducer('notes', state, dispatch);
  const [_tags, setTags] = useNestedXReducer('tags', state, dispatch);
  const [_plans, setPlans] = useNestedXReducer('plans', state, dispatch);
  const [_templates, setTemplates] = useNestedXReducer('templates', state, dispatch);
  const [_pictures, setPictures] = useNestedXReducer('pictures', state, dispatch);
  const [_settings, setSettings] = useNestedXReducer('settings', state, dispatch);
  const [_statuses, setStatuses] = useNestedXReducer('statuses', state, dispatch);
  const [_statusesByThought, setStatusesByThought] = useNestedXReducer('statusesByThought', state, dispatch);
  const [notificationDisabled] = useNestedXReducer('notificationDisabled', state, dispatch);
  const [DBProvider, db, dbReadyState] = useDB();
  const rootRef = useRef(null);

  useEffect(() => {
    if (dbReadyState) {
      initializeApplication(db, dispatch);
      subscribeToChanges(db, {
        thought: setThoughts,
        connection: setConnections,
        note: setNotes,
        tag: setTags,
        plan: setPlans,
        template: setTemplates,
        picture: setPictures,
        setting: setSettings,
        status: setStatuses,
      }, setLastNotification, setStatusesByThought, matchStatusLocationIfEnabled(db));
    }
  }, [db, dbReadyState]);

  const appContext = useMemo(() => ({ dispatch, history }), []);

  const statusOptions = useMemo(() => {
    return STATUS_OPTIONS.slice(0, STATUS_OPTIONS.length - 1).concat(
      Array.isArray(state.settings.customStatuses) ? state.settings.customStatuses : []
    ).concat(STATUS_OPTIONS[STATUS_OPTIONS.length - 1]);
  }, [state.settings.customStatuses]);

  return (
    <Context.Provider value={appContext}>
      <DBProvider value={db}>
        <ModalProvider dynamicState={state}>
          <Div100vh id={'app'} ref={rootRef} className={classes.root}>
            <Notifications lastNotification={lastNotification} notificationDisabled={notificationDisabled}/>
            <PriorityList thoughts={state.thoughts}/>
            <Switch>
              <Route exact path={'/'}>
                {dbReadyState && <Home state={state} statusOptions={statusOptions}/>}
              </Route>
              <Route path={'/settings'}>
                {dbReadyState && <Settings state={state}/>}
              </Route>
              <Route path={'/thought/new'}>
                {dbReadyState && <CreateThought state={state}/>}
              </Route>
              <Route path={'/thought/:id'}>
                {dbReadyState && <Thought state={state} statusOptions={statusOptions}/>}
              </Route>
              <Route path={'/plan/:id/thought/new'}>
                {dbReadyState && <CreateThought state={state}/>}
              </Route>
              <Route path={'/plan/:id/thought/:thoughtId'}>
                {dbReadyState && <Thought state={state} statusOptions={statusOptions}/>}
              </Route>
              <Route path={'/plan/:id/settings'}>
                {dbReadyState && <Settings state={state} />}
              </Route>
              <Route path={'/plan/:id'}>
                {dbReadyState && <Home state={state} statusOptions={statusOptions}/>}
              </Route>
            </Switch> 
          </Div100vh>
        </ModalProvider>  
      </DBProvider>
    </Context.Provider>
  );
};

const initializeApplication = async (db: RxDatabase, dispatch: Dispatch<Action>) => {
  const [ thoughts, connections, plans, notes, tags, templates, pictures, settings, statuses ] = await Promise.all([
    thoughtActions.getThoughts(db),
    connectionActions.getConnections(db),
    planActions.getPlans(db),
    noteActions.getNotes(db),
    tagActions.getTags(db),
    templateActions.getTemplates(db),
    pictureActions.getPictures(db),
    settingActions.getSettings(db),
    statusActions.getStatuses(db),
  ]);

  const statusesById = intoMap(statuses);
  const statusesByThought = thoughtStatuses(statuses);

  const thoughtWithLatestStatus = thoughts.map(thought => {
    if (statusesByThought[thought.id]) {
      const statusId = statusesByThought[thought.id][0];
      const statusText = (statusesById[statusId] as StatusType).text;

      return {
        ...thought,
        status: statusText,
      };
    }

    return thought;
  });
  
  dispatch({
    type: ACTION_TYPES.INITIALIZE_APPLICATION,
    payload: {
      thoughts: thoughtWithLatestStatus,
      connections: intoMap(connections),
      plans,
      notes: intoMap(notes),
      tags: intoMap(tags),
      pictures: intoMap(pictures),
      statuses: statusesById,
      statusesByThought: statusesByThought,
      templates,
      settings: convertSettings(settings),
    },
  });
};

const handleThoughtChange = (setter: Setter<ThoughtState>, setLastNotification: Dispatch<SetStateAction<Notification>>) => ({ data }: RxChangeEvent) => {
  const thought: ThoughtType = data.v;
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => [thought].concat(prev));
      notification = { message: 'Thought created' };
      break;
    
    case 'REMOVE':
      setter(prev => prev.filter((prevThought: ThoughtType) => prevThought.id !== thought.id));
      notification = { message: 'Thought removed' };
      break;

    case 'UPDATE':
      setter(prev => prev.map((prevThought: ThoughtType) => prevThought.id === thought.id ? thought : prevThought).sort(sortByIndexThenDate));
      notification = { message: 'Thought updated' };
      break;
  
    default:
      break;
  }
  setLastNotification(notification);  
};

const handleConnectionChange = (setter: Setter<ConnectionState>, setLastNotification: Dispatch<SetStateAction<Notification>>) => ({ data }: RxChangeEvent) => {
  const connection: ConnectionType = data.v;
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => ({
        ...prev,
        [connection.id]: connection,
      }));
      notification = { message: 'Connection created' };
      break;
    
    case 'REMOVE':
      setter(prev => {
        const next = Object.keys(prev).reduce((nextState, key) => {
          if (key !== connection.id) {
            nextState[key] = prev[key];
          }
          return nextState;
        }, {} as ConnectionState);

        return next;
      });
      notification = { message: 'Connection removed' };
      break;

    case 'UPDATE':
        setter(prev => ({
          ...prev,
          [connection.id]: connection,
        }));
        notification = { message: 'Connection updated' };
      break;
  
    default:
      break;
  }
  setLastNotification(notification);  
};

const handleNoteChange = (setter: Setter<NoteState>, setLastNotification: Dispatch<SetStateAction<Notification>>) => ({ data }: RxChangeEvent) => {
  const note: NoteType = data.v;
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => ({
        ...prev,
        [note.id]: note,
      }));
      notification = { message: 'Note created' };
      break;
    
    case 'REMOVE':
      setter(prev => {
        const next = Object.keys(prev).reduce((nextState, key) => {
          if (key !== note.id) {
            nextState[key] = prev[key];
          }
          return nextState;
        }, {} as NoteState);

        return next;
      });
      notification = { message: 'Note removed' };
      break;

    case 'UPDATE':
        setter(prev => ({
          ...prev,
          [note.id]: note,
        }));
        notification = { message: 'Note updated' };
      break;
  
    default:
      break;
  }
  setLastNotification(notification);  
};

const handlePictureChange = (setter: Setter<PictureState>, setLastNotification: Dispatch<SetStateAction<Notification>>) => ({ data }: RxChangeEvent) => {
  const picture: PictureType = data.v;
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => ({
        ...prev,
        [picture.id]: picture,
      }));
      notification = { message: 'Picture created' };
      break;
    
    case 'REMOVE':
      setter(prev => {
        const next = Object.keys(prev).reduce((nextState, key) => {
          if (key !== picture.id) {
            nextState[key] = prev[key];
          }
          return nextState;
        }, {} as PictureState);

        return next;
      });
      notification = { message: 'Picture removed' };
      break;

    case 'UPDATE':
        setter(prev => ({
          ...prev,
          [picture.id]: picture,
        }));
        notification = { message: 'Picture updated' };
      break;
  
    default:
      break;
  }
  setLastNotification(notification);  
};

const handleSettingChange = (setter: Setter<SettingState>, setLastNotification: Dispatch<SetStateAction<Notification>>) => ({ data }: RxChangeEvent) => {
  const setting: SettingType = {
    ...data.v,
    value: JSON.parse(data.v.value),
  };
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => ({
        ...prev,
        [setting.field]: setting.value,
      }));
      notification = { message: 'Setting updated' };
      break;
    
    case 'REMOVE':
      setter(prev => {
        const next = Object.keys(prev).reduce((nextState, key) => {
          if (key !== setting.field) {
            nextState[key] = prev[key];
          }
          return nextState;
        }, {} as SettingState);

        return next;
      });
      notification = { message: 'Setting removed' };
      break;

    case 'UPDATE':
        setter(prev => ({
          ...prev,
          [setting.field]: setting.value,
        }));
        notification = { message: 'Setting updated' };
      break;
  
    default:
      break;
  }
  setLastNotification(notification);  
};

const handleTagChange = (setter: Setter<TagState>, setLastNotification: Dispatch<SetStateAction<Notification>>) => ({ data }: RxChangeEvent) => {
  const tag: TagType = data.v;
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => ({
        ...prev,
        [tag.id]: tag,
      }));
      notification = { message: 'Tag created' };
      break;
    
    case 'REMOVE':
      setter(prev => {
        const next = Object.keys(prev).reduce((nextState, key) => {
          if (key !== tag.id) {
            nextState[key] = prev[key];
          }
          return nextState;
        }, {} as TagState);

        return next;
      });
      notification = { message: 'Tag removed' };
      break;

    case 'UPDATE':
        setter(prev => ({
          ...prev,
          [tag.id]: tag,
        }));
        notification = { message: 'Tag updated' };
      break;
  
    default:
      break;
  }
  setLastNotification(notification);  
};

const handlePlanChange = (setter: Setter<PlanState>, setLastNotification: Dispatch<SetStateAction<Notification>>) => ({ data }: RxChangeEvent) => {
  const plan: PlanType = data.v;
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => [plan].concat(prev));
      notification = { message: 'Plan created' };
      break;
    
    case 'REMOVE':
      setter(prev => prev.filter(prevPlan => prevPlan.id !== plan.id));
      notification = { message: 'Plan removed' };
      break;

    case 'UPDATE':
      setter(prev => prev.map(prevPlan => prevPlan.id === plan.id ? plan : prevPlan));
      notification = { message: 'Plan updated' };
      break;
  
    default:
      break;
  }
  setLastNotification(notification);  
};

const handleTemplateChange = (setter: Setter<TemplateState>, setLastNotification: Dispatch<SetStateAction<Notification>>) => ({ data }: RxChangeEvent) => {
  const template: TemplateType = {
    ...data.v,
    template: JSON.parse(data.v.template),
  };
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => [template].concat(prev));
      notification = { message: 'Template created' };
      break;
    
    case 'REMOVE':
      setter(prev => prev.filter(prevTemplate => prevTemplate.id !== template.id));
      notification = { message: 'Template removed' };
      break;

    case 'UPDATE':
      setter(prev => prev.map(prevTemplate => prevTemplate.id === template.id ? template : prevTemplate));
      notification = { message: 'Template updated' };
      break;
  
    default:
      break;
  }
  setLastNotification(notification);  
};

const handleStatusChange = (
  setter: Setter<StatusState>,
  setLastNotification: Dispatch<SetStateAction<Notification>>,
  setThoughts: Setter<ThoughtType[]>,
  setStatusesByThought: Setter<StatusesByThought>,
  matchStatusLocationIfEnabled: (status: StatusType) => Promise<void>,
) => ({ data }: RxChangeEvent) => {

  const status: StatusType = data.v;
  let notification;

  switch (data.op) {
    case 'INSERT':
      setter(prev => ({
        ...prev,
        [status.id]: status,
      }));
      setStatusesByThought(prev => ({
        ...prev,
        [status.thoughtId]: [status.id].concat(prev[status.thoughtId] || []),
      }));
      notification = { message: 'Status created' };
      matchStatusLocationIfEnabled(status);
      break;
    
    //TODO Determine whether removal of status is supported. If so, need to update thoughts here
    case 'REMOVE':
      setter(prev => {
        const next = Object.keys(prev).reduce((nextState, key) => {
          if (key !== status.id) {
            nextState[key] = prev[key];
          }
          return nextState;
        }, {} as StatusState);

        return next;
      });
      setStatusesByThought(prev => ({
        ...prev,
        [status.thoughtId]: (prev[status.thoughtId] || []).filter(statusId => statusId !== status.id),
      }));
      notification = { message: 'Status removed' };
      
      break;

    case 'UPDATE':
        setter(prev => ({
          ...prev,
          [status.id]: status,
        }));
        setThoughts(prev => prev.map(prevThought => {
          if (prevThought.id === status.thoughtId) {
            return {
              ...prevThought,
              status: status.text,
            };
          }
          return prevThought;
        }));

      break;
  
    default:
      break;
  }
  if (notification) setLastNotification(notification);
};

const subscribeToChanges = async (
  db: RxDatabase,
  setters: Setters,
  setLastNotification: Dispatch<SetStateAction<Notification>>,
  setStatusesByThought: Setter<StatusesByThought>,
  matchStatusLocationIfEnabled: (status: StatusType) => Promise<void>,
) => {
  //@ts-ignore
  db.thought.$.subscribe(handleThoughtChange(setters.thought, setLastNotification));
  //@ts-ignore
  db.connection.$.subscribe(handleConnectionChange(setters.connection, setLastNotification));
  //@ts-ignore
  db.note.$.subscribe(handleNoteChange(setters.note, setLastNotification));
  //@ts-ignore
  db.tag.$.subscribe(handleTagChange(setters.tag, setLastNotification));
  //@ts-ignore
  db.plan.$.subscribe(handlePlanChange(setters.plan, setLastNotification));
  //@ts-ignore
  db.template.$.subscribe(handleTemplateChange(setters.template, setLastNotification));
  //@ts-ignore
  db.picture.$.subscribe(handlePictureChange(setters.picture, setLastNotification));
  //@ts-ignore
  db.setting.$.subscribe(handleSettingChange(setters.setting, setLastNotification));
  //@ts-ignore
  db.status.$.subscribe(handleStatusChange(setters.status, setLastNotification, setters.thought, setStatusesByThought, matchStatusLocationIfEnabled));
};

export default withStyles(styles)(withRouter(App));
