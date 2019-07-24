import React, { useState, useEffect, useCallback, useRef } from 'react';
import useApp from '../../hooks/useApp';
import { useLoadedDB } from '../../hooks/useDB';
import useXReducer from '../../hooks/useXReducer';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import Phase1 from './Phase1';
import Phase2 from './Phase2';
import Phase3 from './Phase3';
import CreateThoughtSettings from './CreateThoughtSettings';
import CircleButton from '../General/CircleButton';
import Check from '@material-ui/icons/Check';
import Home from '@material-ui/icons/Home';
import Settings from '@material-ui/icons/Settings';
import { createWholeThought } from '../../actions/complex';
import { homeUrl, getIdFromUrl } from '../../lib/util';
import { TYPE_OPTIONS, TAG_OPTIONS } from '../Thought';

const DEFAULT_STATE = {
  title: '',
  typeOptions: TYPE_OPTIONS,
  type: 'Task',
  date: '',
  time: '',
  description: '',
  notes: [],
  tags: [],
  tagOptions: TAG_OPTIONS,
};

export const CreateThought = ({ classes, state }) => {
  const { history, dispatch } = useApp();
  const settingsSVGRef = useRef(null);
  const db = useLoadedDB();
  const [ createdThought, createdThoughtDispatch ] = useXReducer(DEFAULT_STATE, (state, action) => {
    if (action.type === 'CREATE_FROM_TEMPLATE') return action.payload;
    return state;
  });
  const [ phase, setPhase ] = useState(1);
  const [ ready, setReady ] = useState(false);
  const [ displaySettings, setDisplaySettings ] = useState(false);
  const focusInputRef = useRef(() => {});
  const planId = getIdFromUrl(history, 'plan');
  useEffect(() => {
    const timeout = setTimeout(focusInputRef.current, 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async () => {
    const response = await createWholeThought(db, createdThought, planId);
    history.push(`${homeUrl(history)}thought/${response.thought.id}`);
  };

  const setFocusInput = useCallback(focusInput => focusInputRef.current = focusInput, []);
  const handleClickHome = useCallback(() => history.push(homeUrl(history)),[]);
  const handleClickSettings = useCallback(() => {
    setDisplaySettings(prev => !prev);
    if (!displaySettings) {
      gearOpening(settingsSVGRef.current);
    } else {
      gearClosing(settingsSVGRef.current);
    }
  }, [displaySettings]);
  const handleCreateFromTemplate = useCallback(({ template }) => {
    const { thought, notes, tags } = template;

    const thoughtFromTemplate = {
      title: thought.title,
      typeOptions: TYPE_OPTIONS,
      type: thought.type,
      date: thought.date,
      time: thought.time,
      description: thought.description,
      notes: notes.map(note => note.text),
      tags: tags.map(tag => tag.text),
      tagOptions: TAG_OPTIONS,
    };

    createdThoughtDispatch({
      type: 'CREATE_FROM_TEMPLATE',
      payload: thoughtFromTemplate,
    });
  }, []);

  return (
    <div className={classes.root}>
      <Phase1
        classes={classes}
        onNext={() => setPhase(2)}
        isFocus={phase === 1}
        onReady={isReady => setReady(isReady)}
        onFocus={() => setPhase(1)}
        createdThought={createdThought}
        dispatch={createdThoughtDispatch}
        focusTitleInput={setFocusInput}
        thoughts={state.thoughts}
      />
      {phase > 1 && (
        <Phase2
          classes={classes}
          onNext={() => setPhase(3)}
          isFocus={phase === 2}
          onFocus={() => setPhase(2)}
          createdThought={createdThought}
          dispatch={createdThoughtDispatch}
          thoughts={state.thoughts}
        />
      )}
      {phase > 2 && (
        <Phase3
          classes={classes}
          onBack={() => setPhase(2)}
          isFocus={phase === 3}
          createdThought={createdThought}
          dispatch={createdThoughtDispatch}
          thoughts={state.thoughts}
        />
      )}
      <CreateThoughtSettings
        display={displaySettings}
        templates={state.templates}
        onCreateFromTemplate={handleCreateFromTemplate}
        onClose={_ => setDisplaySettings(false)}
      />
      <CircleButton classes={classes} id={'create-thought'} onClick={handleSubmit} label={'Create Thought'} disabled={!ready} Icon={Check}/>
      <CircleButton classes={classes} id={'return-home'} onClick={handleClickHome} label={'Return Home'} Icon={Home}/>
      <CircleButton classes={classes} svgRef={settingsSVGRef} id={'settings'} onClick={handleClickSettings} label={'Settings'} Icon={Settings}/>
    </div>
  );
};

const gearOpening = element => {
  element.classList.add('gear-opening');
};

const gearClosing = element => {
  element.classList.remove('gear-opening');
}

export default withStyles(styles)(CreateThought);
