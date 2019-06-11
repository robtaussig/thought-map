import React, { useEffect, useMemo, useRef } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { styles } from './App.style';
import { appReducer, DEFAULT_STATE } from './reducers';
import { Context } from './store';
import { ACTION_TYPES } from './reducers';
import { intoMap } from './lib/util';
import useXReducer from './hooks/useXReducer';
import { useDB } from './hooks/useDB';
import {
  thoughts as thoughtActions,
  plans as planActions,
  connections as connectionActions,
  notes as noteActions,
  tags as tagActions,
} from './actions';
import Home from './components/Home';
import Settings from './components/Settings';
import CreateThought from './components/CreateThought';
import Thought from './components/Thought';

const App = ({ classes, history }) => {
  const [state, dispatch] = useXReducer(DEFAULT_STATE, appReducer);
  const [DBProvider, db, dbReadyState] = useDB();
  const rootRef = useRef(null);

  useEffect(() => {

    const initializeApplication = async dispatch => {
      dispatch({
        type: ACTION_TYPES.PHASE_PENDING,
        payload: ACTION_TYPES.INITIALIZE_APPLICATION,
      });
    
      const [ thoughts, connections, plans, notes, tags ] = await Promise.all([
        thoughtActions.getThoughts(db),
        connectionActions.getConnections(db),
        planActions.getPlans(db),
        noteActions.getNotes(db),
        tagActions.getTags(db),
      ]);
      
      dispatch({
        type: ACTION_TYPES.INITIALIZE_APPLICATION,
        payload: {
          thoughts,
          connections: intoMap(connections),
          plans,
          notes: intoMap(notes),
          tags: intoMap(tags),
        },
      });
    };

    dbReadyState && initializeApplication(dispatch);
  }, [db, dbReadyState]);

  const appContext = useMemo(() => ({ dispatch, history }), []);

  return (
    <Context.Provider value={appContext}>
      <DBProvider value={db}>
        <div id={'app'} ref={rootRef} className={classes.root}>
          <Switch>
            <Route exact path={'/'}>
              {dbReadyState && <Home state={state}/>}
            </Route>
            <Route path={'/settings'}>
              {dbReadyState && <Settings/>}
            </Route>
            <Route path={'/thought/new'}>
              {dbReadyState && <CreateThought state={state}/>}
            </Route>
            <Route path={'/thought/:id'}>
              {dbReadyState && <Thought state={state}/>}
            </Route>
          </Switch>
        </div>
      </DBProvider>
    </Context.Provider>
  );
};

export default withStyles(styles)(withRouter(App));
