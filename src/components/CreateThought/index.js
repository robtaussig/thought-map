import React, { useState, useEffect, useCallback, useRef } from 'react';
import useApp from '../../hooks/useApp';
import { useLoadedDB } from '../../hooks/useDB';
import useXReducer from '../../hooks/useXReducer';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import Phase1 from './Phase1';
import Phase2 from './Phase2';
import Phase3 from './Phase3';
import CircleButton from '../General/CircleButton';
import Check from '@material-ui/icons/Check';
import Home from '@material-ui/icons/Home';
import { createWholeThought } from '../../actions/complex';

const DEFAULT_STATE = {
  title: '',
  typeOptions: ['Task', 'Todo', 'Reminder', 'Misc'],
  type: 'Task',
  date: '',
  time: '',
  description: '',
  notes: [],
  tags: [],
  tagOptions: ['Select', 'Important', 'Lazy', 'Misc', 'Later'],
};

export const CreateThought = ({ classes, state }) => {
  const { history, dispatch } = useApp();
  const db = useLoadedDB();
  const [ createdThought, createdThoughtDispatch ] = useXReducer(DEFAULT_STATE);
  const [ phase, setPhase ] = useState(1);
  const [ ready, setReady ] = useState(false);
  const focusInputRef = useRef(() => {});

  useEffect(() => {
    const timeout = setTimeout(focusInputRef.current, 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async () => {
    const response = await createWholeThought(db, createdThought);
    history.push(`/thought/${response.thought.id}`);
  };

  const setFocusInput = useCallback(focusInput => focusInputRef.current = focusInput, []);
  const handleClickHome = useCallback(() => history.push('/'),[]);

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
      />
      {phase > 1 && (
        <Phase2
          classes={classes}
          onNext={() => setPhase(3)}
          isFocus={phase === 2}
          onFocus={() => setPhase(2)}
          createdThought={createdThought}
          dispatch={createdThoughtDispatch}
        />
      )}
      {phase > 2 && (
        <Phase3
          classes={classes}
          onBack={() => setPhase(2)}
          isFocus={phase === 3}
          createdThought={createdThought}
          dispatch={createdThoughtDispatch}/>
      )}
      <CircleButton classes={classes} onClick={handleSubmit} label={'Create Thought'} disabled={!ready} Icon={Check}/>
      <CircleButton classes={classes} id={'return-home'} onClick={handleClickHome} label={'Return Home'} Icon={Home}/>
    </div>
  );
};

export default withStyles(styles)(CreateThought);
