import React, { useState, useEffect, useCallback, useRef } from 'react';
import useApp from '../../hooks/useApp';
import useXReducer, { useNestedXReducer } from '../../hooks/useXReducer';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import Phase1 from './Phase1';
import Phase2 from './Phase2';
import Phase3 from './Phase3';
import AddButton from '../Home/AddButton';
import Check from '@material-ui/icons/Check';
import { createWholeThought } from '../../actions/complex';
import { ACTION_TYPES } from '../../reducers';
import { intoMap } from '../../lib/util';

const DEFAULT_STATE = {
  title: '',
  typeOptions: ['Task', 'Todo', 'Reminder', 'Misc'],
  type: 'Task',
  date: '',
  time: '',
  description: '',
  notes: [],
  tags: ['Important', 'Lazy', 'Misc'],
  tagOptions: ['Important', 'Lazy', 'Misc', 'Later'],
};

export const CreateThought = ({ classes, state }) => {
  const { history, dispatch } = useApp();
  const [ createdThought, createdThoughtDispatch ] = useXReducer(DEFAULT_STATE);
  const [ _, setEverything ] = useNestedXReducer('*', state, dispatch);
  const [ phase, setPhase ] = useState(1);
  const [ ready, setReady ] = useState(false);
  const focusInputRef = useRef(() => {});

  useEffect(() => {
    const timeout = setTimeout(focusInputRef.current, 0);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async () => {
    const response = await createWholeThought(createdThought);
    const next = {
      thoughts: state.thoughts.concat(response.thought),
      notes: {
        ...state.notes,
        ...intoMap(response.notes),
      },
      tags: {
        ...state.tags,
        ...intoMap(response.tags),
      },
    }
    setEverything(next);
    history.push(`/thought/${response.thought.id}`);
  };

  const setFocusInput = useCallback(focusInput => focusInputRef.current = focusInput, []);

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
      <AddButton classes={classes} onClick={handleSubmit} label={'Create Thought'} disabled={!ready} Icon={Check}/>
    </div>
  );
};

export default withStyles(styles)(CreateThought);
