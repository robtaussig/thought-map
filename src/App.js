import React, { useEffect, useMemo, useRef } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { styles } from './App.style';
import { appReducer, DEFAULT_STATE } from './reducers';
import { Context } from './store';
import { ACTION_TYPES } from './reducers';
import { intoMap } from './lib/util';
import useXReducer, { useNestedXReducer } from './hooks/useXReducer';
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
  const [_thoughts, setThoughts] = useNestedXReducer('thoughts', state, dispatch);
  const [_connections, setConnections] = useNestedXReducer('connections', state, dispatch);
  const [_notes, setNotes] = useNestedXReducer('notes', state, dispatch);
  const [_tags, setTags] = useNestedXReducer('tags', state, dispatch);
  const [_plans, setPlans] = useNestedXReducer('plans', state, dispatch);
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
      });
    }
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

const initializeApplication = async (db, dispatch) => {
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

const handleThoughtChange = setter => ({ data }) => {
  const thought = data.v;
  switch (data.op) {
    case 'INSERT':
      setter(prev => prev.concat(thought));
      break;
    
    case 'REMOVE':
      setter(prev => prev.filter(prevThought => prevThought.id !== thought.id));
      break;

    case 'UPDATE':
      setter(prev => prev.map(prevThought => prevThought.id === thought.id ? thought : prevThought));
      break;
  
    default:
      break;
  }
};

const handleConnectionChange = setter => ({ data }) => {
  const connection = data.v;
  switch (data.op) {
    case 'INSERT':
      setter(prev => ({
        ...prev,
        [connection.id]: connection,
      }));
      break;
    
    case 'REMOVE':
      setter(prev => {
        const next = Object.keys(prev).reduce((nextState, key) => {
          if (key !== connection.id) {
            nextState[key] = prev[key];
          }
          return nextState;
        }, {});

        return next;
      });
      break;

    case 'UPDATE':
        setter(prev => ({
          ...prev,
          [connection.id]: connection,
        }));
      break;
  
    default:
      break;
  }
};

const handleNoteChange = setter => ({ data }) => {
  const note = data.v;
  switch (data.op) {
    case 'INSERT':
      setter(prev => ({
        ...prev,
        [note.id]: note,
      }));
      break;
    
    case 'REMOVE':
      setter(prev => {
        const next = Object.keys(prev).reduce((nextState, key) => {
          if (key !== note.id) {
            nextState[key] = prev[key];
          }
          return nextState;
        }, {});

        return next;
      });
      break;

    case 'UPDATE':
        setter(prev => ({
          ...prev,
          [note.id]: note,
        }));
      break;
  
    default:
      break;
  }
};

const handleTagChange = setter => ({ data }) => {
  const tag = data.v;
  switch (data.op) {
    case 'INSERT':
      setter(prev => ({
        ...prev,
        [tag.id]: tag,
      }));
      break;
    
    case 'REMOVE':
      setter(prev => {
        const next = Object.keys(prev).reduce((nextState, key) => {
          if (key !== tag.id) {
            nextState[key] = prev[key];
          }
          return nextState;
        }, {});

        return next;
      });
      break;

    case 'UPDATE':
        setter(prev => ({
          ...prev,
          [tag.id]: tag,
        }));
      break;
  
    default:
      break;
  }
};

const handlePlanChange = setter => ({ data }) => {
  const plan = data.v;
  switch (data.op) {
    case 'INSERT':
      setter(prev => prev.concat(plan));
      break;
    
    case 'REMOVE':
      setter(prev => prev.filter(prevPlan => prevPlan.id !== plan.id));
      break;

    case 'UPDATE':
      setter(prev => prev.map(prevPlan => prevPlan.id === plan.id ? plan : prevPlan));
      break;
  
    default:
      break;
  }
};

const subscribeToChanges = async (db, setters) => {
  db.thought.$.subscribe(handleThoughtChange(setters.thought));
  db.connection.$.subscribe(handleConnectionChange(setters.connection));
  db.note.$.subscribe(handleNoteChange(setters.note));
  db.tag.$.subscribe(handleTagChange(setters.tag));
  db.plan.$.subscribe(handlePlanChange(setters.plan));
};

export default withStyles(styles)(withRouter(App));
