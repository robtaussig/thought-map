import React, { FC, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { AppProps, Notification as NotificationType } from '../types';
import { backupSelector } from '../reducers/backups';
import { Context as AppContext } from '../store';
import { ModalContextValue } from '../hooks/useModal/types';
import { ModalProvider } from '../hooks/useModal';
import { statusOptionsSelector } from '../reducers/statusOptions';
import { useAppStyles } from './style';
import { subscribeToChanges } from '../store/updates';
import { Switch, Route, withRouter } from 'react-router-dom';
import { tagOptionsSelector } from '../reducers/tagOptions';
import { typeOptionsSelector } from '../reducers/typeOptions';
import { useDB } from '../hooks/useDB';
import { useDispatch, useSelector } from 'react-redux';
import Backups from '../components/Backups';
import Connections from '../components/Connections';
import Div100vh from 'react-div-100vh';
import History from '../components/History';
import Home from '../components/Home';
import { GoogleCalendarProvider } from '../hooks/useGoogleCalendar';
import initializeApplication from '../store/init';
import LeftButton from '../components/MainButtons/left';
import Merge from '../components/Merge';
import MiddleButton from '../components/MainButtons/middle';
import Notifications from '../components/Notifications';
import ProcessMerge from '../components/Merge/ProcessMerge';
import PrivacyPolicy from '../components/PrivacyPolicy';
import RightButton from '../components/MainButtons/right';
import Settings from '../components/Settings';
import Stage from '../components/Stage';
import Timeline from '../components/Timeline';
import Thought from '../components/Thought';
import { checkVersionAndOpenModalIfUpdate } from './util';

const App: FC<AppProps> = ({ history }) => {
  const [DBProvider, dbContext, dbReadyState] = useDB();
  const dispatch = useDispatch();
  const classes = useAppStyles({});

  const rootRef = useRef(null);
  const modalRef = useRef<ModalContextValue>(null); 
  const [lastNotification, setLastNotification] = useState<NotificationType>(null); 

  const backups = useSelector(backupSelector);
  const statusOptions = useSelector(statusOptionsSelector);
  const typeOptions = useSelector(typeOptionsSelector);
  const tagOptions = useSelector(tagOptionsSelector);

  const appContext = useMemo(() => ({ history }), []);
  const getModalContext = useCallback(modalContext => modalRef.current = modalContext,[]);    

  useEffect(() => {
    const checkLatestVersion = async () => {
      if (document.visibilityState === 'visible') {
        checkVersionAndOpenModalIfUpdate(backups, modalRef);
      }
    }

    document.addEventListener("visibilitychange", checkLatestVersion);
    return () => document.removeEventListener("visibilitychange", checkLatestVersion);
  }, [backups]);

  useEffect(() => {
    if (dbReadyState) {
      const init = async () => {
        const backups = await initializeApplication(dbContext.db, dispatch);
        document.body.classList.remove('loader');
        checkVersionAndOpenModalIfUpdate(backups, modalRef);
      };

      const unsubscribe = subscribeToChanges(dbContext.db, dispatch, setLastNotification);
      
      init();
      return () => unsubscribe();
    }
  }, [dbContext.db, dbReadyState]);  

  return (
    <AppContext.Provider value={appContext}>
      <DBProvider value={dbContext}>
        <GoogleCalendarProvider>
          <ModalProvider getContext={getModalContext}>
            <Div100vh id={'app'} ref={rootRef} className={classes.root}>
              <Notifications lastNotification={lastNotification} />
              <LeftButton/>
              <MiddleButton/>
              <RightButton typeOptions={typeOptions}/>
              <Switch>
                <Route path={'/privacy'}>
                  <PrivacyPolicy/>
                </Route>
                <Route exact path={'/'}>
                  {dbReadyState && <Home statusOptions={statusOptions} setLastNotification={setLastNotification} typeOptions={typeOptions}/>}
                </Route>
                <Route path={'/settings'}>
                  {dbReadyState && <Settings typeOptions={typeOptions} setLastNotification={setLastNotification}/>}
                </Route>
                <Route path={'/thought/:id/connections'}>
                  {dbReadyState && <Connections statusOptions={statusOptions}/>}
                </Route>
                <Route path={'/thought/:id/history'}>
                  {dbReadyState && <History statusOptions={statusOptions}/>}
                </Route>
                <Route path={'/plan/:id/timeline'}>
                  {dbReadyState && <Timeline/>}
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
                <Route path={'/timeline'}>
                  {dbReadyState && <Timeline allPlans={true}/>}
                </Route>
              </Switch> 
            </Div100vh>
          </ModalProvider>
        </GoogleCalendarProvider>
      </DBProvider>
    </AppContext.Provider>
  );
};

export default withRouter(App);
