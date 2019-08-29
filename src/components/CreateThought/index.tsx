import React, { useState, useEffect, useCallback, useRef, FC } from 'react';
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
import { Note } from '../../store/rxdb/schemas/note';
import { Tag } from '../../store/rxdb/schemas/tag';
import { Template } from '../../store/rxdb/schemas/template';
import { AppState } from '../../reducers';

export interface CreatedThought {
  title: string,
  typeOptions: string[],
  type: string,
  date: string,
  time: string,
  description: string,
  notes: string[],
  tags: string[],
  tagOptions: string[],
}

const DEFAULT_STATE: CreatedThought = {
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

interface CreateThoughtProps {
  classes: any,
  state: AppState,
}

export const CreateThought: FC<CreateThoughtProps> = ({ classes, state }) => {
  const { history } = useApp();
  const settingsSVGRef = useRef<HTMLElement>(null);
  const db = useLoadedDB();
  const [ createdThought, createdThoughtDispatch ] = useXReducer(DEFAULT_STATE, (state, action) => {
    if (action.type === 'CREATE_FROM_TEMPLATE') return action.payload;
    return state;
  });
  const [ phase, setPhase ] = useState<number>(1);
  const [ ready, setReady ] = useState<boolean>(false);
  const [ displaySettings, setDisplaySettings ] = useState<boolean>(false);
  const focusInputRef = useRef<() => void>(() => {});
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
  const handleCreateFromTemplate = useCallback(({ template }: Template) => {
    const { thought, notes, tags } = template;

    const thoughtFromTemplate = {
      title: thought.title,
      typeOptions: TYPE_OPTIONS,
      type: thought.type,
      date: thought.date,
      time: thought.time,
      description: thought.description,
      notes: notes.map((note: Note) => note.text),
      tags: tags.map((tag: Tag) => tag.text),
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
        onReady={(isReady: boolean) => setReady(isReady)}
        onFocus={() => setPhase(1)}
        createdThought={createdThought}
        dispatch={createdThoughtDispatch}
        focusTitleInput={setFocusInput}
        thoughts={state.thoughts}
      />
      <CreateThoughtSettings
        display={displaySettings}
        templates={state.templates}
        onCreateFromTemplate={handleCreateFromTemplate}
        onClose={() => setDisplaySettings(false)}
      />
      <CircleButton classes={classes} id={'create-thought'} onClick={handleSubmit} label={'Create Thought'} disabled={!ready} Icon={Check}/>
      <CircleButton classes={classes} id={'return-home'} onClick={handleClickHome} label={'Return Home'} Icon={Home}/>
      <CircleButton classes={classes} svgRef={settingsSVGRef} id={'settings'} onClick={handleClickSettings} label={'Settings'} Icon={Settings}/>
    </div>
  );
};

const gearOpening = (element: HTMLElement): void => {
  element.classList.add('gear-opening');
};

const gearClosing = (element: HTMLElement): void => {
  element.classList.remove('gear-opening');
}

export default withStyles(styles)(CreateThought);
