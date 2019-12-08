import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { styles } from './App.style';
import { Context as AppContext } from './store';
import { useDispatch, useSelector, Selector } from 'react-redux';
import { subscribeToChanges } from './store/updates';
import initializeApplication from './store/init';
import { useDB } from './hooks/useDB';
import Home from './components/Home';
import PriorityList from './components/Home/PriorityList';
import Settings from './components/Settings';
import Thought from './components/Thought';
import MiddleButton from './components/MainButtons/middle';
import RightButton from './components/MainButtons/right';
import LeftButton from './components/MainButtons/left';
import Stage from './components/Stage';
import Notifications from './components/Notifications';
import Connections from './components/Connections';
import History from './components/History';
import { ModalProvider } from './hooks/useModal';
import Div100vh from 'react-div-100vh';
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
  const [lastNotification, setLastNotification] = useState<Notification>(null);
  const [DBProvider, db, dbReadyState] = useDB();
  const rootRef = useRef(null);

  useEffect(() => {
    if (dbReadyState) {
      initializeApplication(db, dispatch).then(() => {
        document.body.classList.remove('loader');
      });
      subscribeToChanges(db, dispatch, setLastNotification);
    }
  }, [db, dbReadyState]);

  const appContext = useMemo(() => ({ history }), []);

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
      <DBProvider value={db}>
        <ModalProvider>
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
            </Switch> 
          </Div100vh>
        </ModalProvider>  
      </DBProvider>
    </AppContext.Provider>
  );
};

export default withStyles(styles)(withRouter(App));
