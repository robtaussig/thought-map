import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { styles } from './App.style';
import { appReducer, DEFAULT_STATE } from './reducers';
import { Context } from './store';
import { sortByIndexThenDate } from './models/base';
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
  templates as templateActions,
} from './actions';
import Home from './components/Home';
import PriorityList from './components/Home/PriorityList';
import Settings from './components/Settings';
import CreateThought from './components/CreateThought';
import Thought from './components/Thought';
import Notifications from './components/Notifications';
import { ModalProvider } from './hooks/useModal';

const App = ({ classes, history }) => {
  const [state, dispatch] = useXReducer(DEFAULT_STATE, appReducer);
  const [lastNotification, setLastNotification] = useState(null);
  const [_thoughts, setThoughts] = useNestedXReducer('thoughts', state, dispatch);
  const [_connections, setConnections] = useNestedXReducer('connections', state, dispatch);
  const [_notes, setNotes] = useNestedXReducer('notes', state, dispatch);
  const [_tags, setTags] = useNestedXReducer('tags', state, dispatch);
  const [_plans, setPlans] = useNestedXReducer('plans', state, dispatch);
  const [_templates, setTemplates] = useNestedXReducer('templates', state, dispatch);
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
      }, setLastNotification);
    }
  }, [db, dbReadyState]);

  const appContext = useMemo(() => ({ dispatch, history }), []);

  return (
    <Context.Provider value={appContext}>
      <DBProvider value={db}>
        <ModalProvider>
          <div id={'app'} ref={rootRef} className={classes.root}>
            <Notifications lastNotification={lastNotification}/>
            <PriorityList thoughts={state.thoughts}/>
            <Switch>
              <Route exact path={'/'}>
                {dbReadyState && <Home state={state}/>}
              </Route>
              <Route path={'/settings'}>
                {dbReadyState && <Settings state={state}/>}
              </Route>
              <Route path={'/thought/new'}>
                {dbReadyState && <CreateThought state={state}/>}
              </Route>
              <Route path={'/thought/:id'}>
                {dbReadyState && <Thought state={state}/>}
              </Route>
              <Route path={'/plan/:id/thought/new'}>
                {dbReadyState && <CreateThought state={state}/>}
              </Route>
              <Route path={'/plan/:id/thought/:thoughtId'}>
                {dbReadyState && <Thought state={state}/>}
              </Route>
              <Route path={'/plan/:id/settings'}>
                {dbReadyState && <Settings state={state}/>}
              </Route>
              <Route path={'/plan/:id'}>
                {dbReadyState && <Home state={state}/>}
              </Route>
            </Switch> 
          </div>
        </ModalProvider>  
      </DBProvider>
    </Context.Provider>
  );
};

const initializeApplication = async (db, dispatch) => {
  dispatch({
    type: ACTION_TYPES.PHASE_PENDING,
    payload: ACTION_TYPES.INITIALIZE_APPLICATION,
  });

  const [ thoughts, connections, plans, notes, tags, templates ] = await Promise.all([
    thoughtActions.getThoughts(db),
    connectionActions.getConnections(db),
    planActions.getPlans(db),
    noteActions.getNotes(db),
    tagActions.getTags(db),
    templateActions.getTemplates(db),
  ]);
  
  dispatch({
    type: ACTION_TYPES.INITIALIZE_APPLICATION,
    payload: {
      thoughts,
      connections: intoMap(connections),
      plans,
      notes: intoMap(notes),
      tags: intoMap(tags),
      templates,
    },
  });
};

const handleThoughtChange = (setter, setLastNotification) => ({ data }) => {
  const thought = data.v;
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => [thought].concat(prev));
      notification = { message: 'Thought created' };
      break;
    
    case 'REMOVE':
      setter(prev => prev.filter(prevThought => prevThought.id !== thought.id));
      notification = { message: 'Thought removed' };
      break;

    case 'UPDATE':
      setter(prev => prev.map(prevThought => prevThought.id === thought.id ? thought : prevThought).sort(sortByIndexThenDate));
      notification = { message: 'Thought updated' };
      break;
  
    default:
      break;
  }
  setLastNotification(notification);  
};

const handleConnectionChange = (setter, setLastNotification) => ({ data }) => {
  const connection = data.v;
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
        }, {});

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

const handleNoteChange = (setter, setLastNotification) => ({ data }) => {
  const note = data.v;
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
        }, {});

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

const handleTagChange = (setter, setLastNotification) => ({ data }) => {
  const tag = data.v;
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
        }, {});

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

const handlePlanChange = (setter, setLastNotification) => ({ data }) => {
  const plan = data.v;
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

const handleTemplateChange = (setter, setLastNotification) => ({ data }) => {
  const template = {
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

const subscribeToChanges = async (db, setters, setLastNotification) => {
  db.thought.$.subscribe(handleThoughtChange(setters.thought, setLastNotification));
  db.connection.$.subscribe(handleConnectionChange(setters.connection, setLastNotification));
  db.note.$.subscribe(handleNoteChange(setters.note, setLastNotification));
  db.tag.$.subscribe(handleTagChange(setters.tag, setLastNotification));
  db.plan.$.subscribe(handlePlanChange(setters.plan, setLastNotification));
  db.template.$.subscribe(handleTemplateChange(setters.template, setLastNotification));
};

export default withStyles(styles)(withRouter(App));
