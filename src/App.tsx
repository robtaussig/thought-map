import React, { FC, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { styles } from './App.style';
import { Context as AppContext } from './store';
import { useDispatch, useSelector, Selector } from 'react-redux';
import { subscribeToChanges } from './store/updates';
import initializeApplication from './store/init';
import { backupSelector } from './reducers/backups';
import { useDB } from './hooks/useDB';
import Home from './components/Home';
import Backups from './components/Backups';
import Settings from './components/Settings';
import Thought from './components/Thought';
import Merge from './components/Merge';
import UpdateAvailable from './components/Merge/UpdateAvailable';
import ProcessMerge from './components/Merge/ProcessMerge';
import MiddleButton from './components/MainButtons/middle';
import RightButton from './components/MainButtons/right';
import LeftButton from './components/MainButtons/left';
import Stage from './components/Stage';
import Notifications from './components/Notifications';
import Connections from './components/Connections';
import History from './components/History';
import { ModalProvider } from './hooks/useModal';
import { ModalContextValue } from './hooks/useModal/types';
import { getVersion } from './components/Settings/components/SetupBackup/api';
import Div100vh from 'react-div-100vh';
import { useSocketIO, ReadyState } from 'react-use-websocket';
import { Options } from 'react-use-websocket/src/lib/use-websocket';
import {
  AppProps,
  Notification,
} from './types';
import { RootState } from './reducers/';
import { Settings as SettingsType } from './reducers/settings';

const STATUS_OPTIONS: string[] = ['new', 'in progress', 'won\'t fix', 'completed'];
const TYPE_OPTIONS: string[] = ['Task', 'Todo', 'Reminder', 'Misc', 'Collection'];
const TAG_OPTIONS: string[] = ['Important', 'Misc', 'Later'];

const settingsSelector: Selector<RootState, SettingsType> = state => state.settings;

const App: FC<AppProps> = ({ classes, history }) => {
  const dispatch = useDispatch();
  const settings = useSelector(settingsSelector);
  const backups = useSelector(backupSelector);
  const [lastNotification, setLastNotification] = useState<Notification>(null);
  const [DBProvider, dbContext, dbReadyState] = useDB();
  const rootRef = useRef(null);
  const modalRef = useRef<ModalContextValue>(null);

  const options: Options = useMemo(() =>({
    shouldReconnect: () => {
      return true;
    },
    reconnectAttempts: 100,
    reconnectInterval: 20000,
    retryOnError: true,
  }), []);

  const [sendMessage, lastMessage, readyState, getWebSocket] = useSocketIO('https://robtaussig.com/', options);

  useEffect(() => {
    const payloadToSocketIOMessage = (payload: [string, any?]) => `42${JSON.stringify(payload)}`;

    if (readyState === ReadyState.OPEN) {
      sendMessage(payloadToSocketIOMessage(['subscribe-backup']));
    }
  }, [readyState]);

  useEffect(() => {
    const handleCheckWebSocket = () => {
      if (document.visibilityState === 'visible') {
        if (getWebSocket().readyState !== ReadyState.OPEN) {
          (getWebSocket() as any).reconnect?.current?.() ?? alert('This did not work');
        }
      }
    }
    document.addEventListener("visibilitychange", handleCheckWebSocket);
    return () => document.removeEventListener("visibilitychange", handleCheckWebSocket);
  }, []);

  useEffect(() => {
    if (dbReadyState) {
      const init = async () => {
        const backups = await initializeApplication(dbContext.db, dispatch);
        document.body.classList.remove('loader');
        const activeBackup = backups.find(({ isActive }) => Boolean(isActive));
        if (activeBackup) {
          const response = await getVersion(activeBackup.backupId);
          if (response?.version > activeBackup.version) {
            let modalId = modalRef.current.openModal(
              <UpdateAvailable
                activeBackup={activeBackup}
                latestVersion={response.version}
                onClose={() => modalRef.current.closeModal(modalId)}
              />, 'Update Available'
            );
          }
        }
      };

      const unsubscribe = subscribeToChanges(dbContext.db, dispatch, setLastNotification);
      
      init();
      return () => unsubscribe();
    }
  }, [dbContext.db, dbReadyState]);

  useEffect(() => {
    if (lastMessage && lastMessage.type === 'update-backup') {
      const updatedBackup = backups.find(({ backupId }) => backupId === lastMessage.payload.uuid);
      if (updatedBackup && updatedBackup.version < lastMessage.payload.version) {
        let modalId = modalRef.current.openModal(
          <UpdateAvailable
            activeBackup={updatedBackup}
            latestVersion={lastMessage.payload.version}
            onClose={() => modalRef.current.closeModal(modalId)}
          />, 'Update Available'
        );
      }
    }
  }, [lastMessage, backups]);

  const appContext = useMemo(() => ({ history }), []);

  const getModalContext = useCallback(modalContext => modalRef.current = modalContext,[]);

  const statusOptions = useMemo(() => {
    return STATUS_OPTIONS.slice(0, STATUS_OPTIONS.length - 1).concat(
      Array.isArray(settings.customStatuses) ? settings.customStatuses : []
    ).concat(STATUS_OPTIONS[STATUS_OPTIONS.length - 1]);
  }, [settings.customStatuses]);

  const typeOptions = useMemo(() => {
    return TYPE_OPTIONS.concat(
      Array.isArray(settings.customTypes) ? settings.customTypes : []
    );
  }, [settings.customTypes]);

  const tagOptions = useMemo(() => {
    return ['Select', ...TAG_OPTIONS].concat(
      Array.isArray(settings.customTags) ? settings.customTags : []
    );
  }, [settings.customTags]);

  return (
    <AppContext.Provider value={appContext}>
      <DBProvider value={dbContext}>
        <ModalProvider getContext={getModalContext}>
          <Div100vh id={'app'} ref={rootRef} className={classes.root}>
            <Notifications lastNotification={lastNotification} />
            <LeftButton/>
            <MiddleButton/>
            <RightButton typeOptions={typeOptions}/>
            <Switch>
              <Route exact path={'/'}>
                {dbReadyState && <Home statusOptions={statusOptions} setLastNotification={setLastNotification} typeOptions={typeOptions}/>}
              </Route>
              <Route path={'/settings'}>
                {dbReadyState && <Settings typeOptions={typeOptions} setLastNotification={setLastNotification}/>}
              </Route>
              <Route path={'/thought/:id/connections'}>
                {dbReadyState && <Connections statusOptions={statusOptions}/>}
              </Route>
              <Route path={'/plan/:id/history'}>
                {dbReadyState && <History statusOptions={statusOptions}/>}
              </Route>
              <Route path={'/thought/:id/history'}>
                {dbReadyState && <History statusOptions={statusOptions}/>}
              </Route>
              <Route path={'/plan/:id/thought/:id/history'}>
                {dbReadyState && <History statusOptions={statusOptions}/>}
              </Route>
              <Route path={'/thought/:id'}>
                {dbReadyState && <Thought statusOptions={statusOptions} typeOptions={typeOptions} tagOptions={tagOptions}/>}
              </Route>
              <Route path={'/plan/:id/thought/:thoughtId/connections'}>
                {dbReadyState && <Connections statusOptions={statusOptions}/>}
              </Route>
              <Route path={'/plan/:id/thought/:thoughtId'}>
                {dbReadyState && <Thought statusOptions={statusOptions} typeOptions={typeOptions} tagOptions={tagOptions}/>}
              </Route>
              <Route path={'/plan/:id/settings'}>
                {dbReadyState && <Settings typeOptions={typeOptions} setLastNotification={setLastNotification}/>}
              </Route>
              <Route path={'/plan/:id'}>
                {dbReadyState && <Home statusOptions={statusOptions} setLastNotification={setLastNotification} typeOptions={typeOptions}/>}
              </Route>
              <Route path={'/stage'}>
                {dbReadyState && <Stage/>}  
              </Route>
              <Route path={'/backups'}>
                {dbReadyState && <Backups/>}
              </Route>
              <Route path={'/merge/:backupId'}>
                {dbReadyState && <Merge/>}
              </Route>
              <Route path={'/process-merge/:backupId'}>
                {dbReadyState && <ProcessMerge/>}
              </Route>
            </Switch> 
          </Div100vh>
        </ModalProvider>
      </DBProvider>
    </AppContext.Provider>
  );
};

export default withStyles(styles)(withRouter(App));
