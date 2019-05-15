import React, { useReducer, useEffect } from 'react';
import { withStyles } from '@material-ui/core';
import { styles } from './App.style';
import { appReducer, DEFAULT_STATE } from './reducers';
import { Context } from './store';
import { ACTION_TYPES } from './reducers';
import { thoughts as thoughtActions, plans as planActions, connections as connectionActions } from './actions';
import Thoughts from './components/Thoughts';
import Plans from './components/Plans';
import Connections from './components/Connections';

const App = ({ classes }) => {
  const [state, dispatch] = useReducer(appReducer, DEFAULT_STATE);

  useEffect(() => {

    const initializeApplication = async dispatch => {
      dispatch({
        type: ACTION_TYPES.PHASE_PENDING,
        payload: ACTION_TYPES.INITIALIZE_APPLICATION,
      });
    
      const [ thoughts, connections, plans ] = await Promise.all([
        thoughtActions.getThoughts(),
        connectionActions.getConnections(),
        planActions.getPlans(),
      ]);

      dispatch({
        type: ACTION_TYPES.INITIALIZE_APPLICATION,
        payload: {
          thoughts, connections, plans
        },
      });
    };

    initializeApplication(dispatch);
  }, []);

  console.log(state);

  return (
    <Context.Provider value={dispatch}>
      <div className={classes.root}>
        <Thoughts
          thoughts={state.thoughts}
        />
        <Plans
          plans={state.plans}
        />
        <Connections
          connections={state.connections}
        />
      </div>
    </Context.Provider>
  );
};

export default withStyles(styles)(App);
