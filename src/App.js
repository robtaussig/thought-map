import React, { useReducer, useEffect, useMemo, useRef } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { styles } from './App.style';
import { appReducer, DEFAULT_STATE } from './reducers';
import { Context } from './store';
import { ACTION_TYPES } from './reducers';
import {
  thoughts as thoughtActions,
  plans as planActions,
  connections as connectionActions,
  notes as noteActions,
  tags as tagActions,
} from './actions';
import Home from './components/Home';
import Settings from './components/Settings';

const App = ({ classes, history }) => {
  const [state, dispatch] = useReducer(appReducer, DEFAULT_STATE);
  const rootRef = useRef(null);

  useEffect(() => {

    const initializeApplication = async dispatch => {
      dispatch({
        type: ACTION_TYPES.PHASE_PENDING,
        payload: ACTION_TYPES.INITIALIZE_APPLICATION,
      });
    
      const [ thoughts, connections, plans, notes, tags ] = await Promise.all([
        thoughtActions.getThoughts(),
        connectionActions.getConnections(),
        planActions.getPlans(),
        noteActions.getNotes(),
        tagActions.getTags(),
      ]);

      const intoMap = items => {
        return items.reduce((all, each) => {
          all[each.id] = each;
          return all;
        }, {});
      };
      
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

    initializeApplication(dispatch);
  }, []);

  const appContext = useMemo(() => ({ dispatch, history }), []);

  return (
    <Context.Provider value={appContext}>
      <div id={'app'} ref={rootRef} className={classes.root}>
        <Switch>
          <Route exact path={'/'}>
            <Home state={state}/>
          </Route>
          <Route path={'/settings'}>
            <Settings/>
          </Route>
        </Switch>
      </div>
    </Context.Provider>
  );
};

export default withStyles(styles)(withRouter(App));
