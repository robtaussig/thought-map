import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { styles } from './App.style';
import { appReducer, DEFAULT_STATE } from './reducers';
import { Context } from './store';
import { subscribeToChanges } from './store/updates';
import initializeApplication from './store/init';
import useXReducer, { useNestedXReducer } from './hooks/useXReducer';
import { useDB } from './hooks/useDB';
import Home from './components/Home';
import PriorityList from './components/Home/PriorityList';
import Settings from './components/Settings';
import Thought from './components/Thought';
import Notifications from './components/Notifications';
import Connections from './components/Connections';
import { ModalProvider } from './hooks/useModal';
import Div100vh from 'react-div-100vh';
import {
  AppProps,
  Notification,
} from './types';

const STATUS_OPTIONS: string[] = ['new', 'in progress', 'won\'t fix', 'completed'];
const TYPE_OPTIONS: string[] = ['Task', 'Todo', 'Reminder', 'Misc', 'Collection'];
const TAG_OPTIONS: string[] = ['Important', 'Misc', 'Later'];

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
      initializeApplication(db, dispatch).then(() => {
        document.body.classList.remove('loader');
      });
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
      },
        setLastNotification,
        setStatusesByThought,
      );
    }
  }, [db, dbReadyState]);

  const appContext = useMemo(() => ({ dispatch, history }), []);

  const statusOptions = useMemo(() => {
    return STATUS_OPTIONS.slice(0, STATUS_OPTIONS.length - 1).concat(
      Array.isArray(state.settings.customStatuses) ? state.settings.customStatuses : []
    ).concat(STATUS_OPTIONS[STATUS_OPTIONS.length - 1]);
  }, [state.settings.customStatuses]);

  const typeOptions = useMemo(() => {
    return TYPE_OPTIONS.concat(
      Array.isArray(state.settings.customTypes) ? state.settings.customTypes : []
    );
  }, [state.settings.customTypes]);

  const tagOptions = useMemo(() => {
    return ['Select', ...TAG_OPTIONS].concat(
      Array.isArray(state.settings.customTags) ? state.settings.customTags : []
    );
  }, [state.settings.customTags]);

  return (
    <Context.Provider value={appContext}>
      <DBProvider value={db}>
        <ModalProvider dynamicState={state}>
          <Div100vh id={'app'} ref={rootRef} className={classes.root}>
            <Notifications lastNotification={lastNotification} notificationDisabled={notificationDisabled}/>
            <PriorityList thoughts={state.thoughts}/>
            <Switch>
              <Route exact path={'/'}>
                {dbReadyState && <Home state={state} statusOptions={statusOptions} setLastNotification={setLastNotification} typeOptions={typeOptions} tagOptions={tagOptions}/>}
              </Route>
              <Route path={'/settings'}>
                {dbReadyState && <Settings state={state} typeOptions={typeOptions} setLastNotification={setLastNotification}/>}
              </Route>
              <Route path={'/thought/:id/connections'}>
                {dbReadyState && <Connections state={state}/>}
              </Route>
              <Route path={'/thought/:id'}>
                {dbReadyState && <Thought state={state} statusOptions={statusOptions} typeOptions={typeOptions} tagOptions={tagOptions}/>}
              </Route>
              <Route path={'/plan/:id/thought/:thoughtId/connections'}>
                {dbReadyState && <Connections state={state}/>}
              </Route>
              <Route path={'/plan/:id/thought/:thoughtId'}>
                {dbReadyState && <Thought state={state} statusOptions={statusOptions} typeOptions={typeOptions} tagOptions={tagOptions}/>}
              </Route>
              <Route path={'/plan/:id/settings'}>
                {dbReadyState && <Settings state={state} typeOptions={typeOptions} setLastNotification={setLastNotification}/>}
              </Route>
              <Route path={'/plan/:id'}>
                {dbReadyState && <Home state={state} statusOptions={statusOptions} setLastNotification={setLastNotification} typeOptions={typeOptions} tagOptions={tagOptions}/>}
              </Route>
            </Switch> 
          </Div100vh>
        </ModalProvider>  
      </DBProvider>
    </Context.Provider>
  );
};

export default withStyles(styles)(withRouter(App));
