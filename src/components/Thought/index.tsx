import React, { useMemo, useCallback, useState, useRef, FC } from 'react';
import useApp from '../../hooks/useApp';
import { useLoadedDB } from '../../hooks/useDB';
import { withStyles } from '@material-ui/core/styles';
import Home from '@material-ui/icons/Home';
import Settings from '@material-ui/icons/Settings';
import { styles } from './styles';
import Loading from '../Loading';
import ThoughtInformation from './ThoughtInformation';
import ThoughtSettings from '../ThoughtSettings';
import CreateConnectionsFromThought from './components/CreateConnectionsFromThought';
import CircleButton from '../General/CircleButton';
import { thoughts as thoughtActions } from '../../actions';
import { openConfirmation, homeUrl, getIdFromUrl } from '../../lib/util';
import { AppState } from 'reducers';

export interface PriorityOption {
  value: number;
  label: string;
}

interface ThoughtProps {
  classes: any;
  state: AppState;
  statusOptions: string[];
}

export const TYPE_OPTIONS: string[] = ['Task', 'Todo', 'Reminder', 'Misc'];
export const TAG_OPTIONS: string[] = ['Select', 'Important', 'Lazy', 'Misc', 'Later'];
export const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 0, label: 'NOT RELEVANT (HIDE)' },
  { value: 1, label: 'LOW' },
  { value: 5, label: 'MEDIUM' },
  { value: 10, label: 'HIGH' },
];

export const Thought: FC<ThoughtProps> = ({ classes, state, statusOptions }) => {
  
  const db = useLoadedDB();
  const { history } = useApp();
  const returnHomeSVGRef = useRef<HTMLElement>(null);
  const [editState, setEditState] = useState<boolean>(false);
  const [displaySettings, setDisplaySettings] = useState<boolean>(false);
  const thoughtId = getIdFromUrl(history, 'thought');
  const thought = useMemo(() => state.thoughts.find(thought => thought.id === thoughtId), [thoughtId, state.thoughts]);
  const relatedTags = useMemo(() => Object.values(state.tags).filter(tag => tag.thoughtId === thoughtId), [thoughtId, state.tags]);
  const relatedNotes = useMemo(() => Object.values(state.notes).filter(note => note.thoughtId === thoughtId), [thoughtId, state.notes]);
  const statuses = useMemo(() => {    
    if (typeof thoughtId === 'string') {
      return (state.statusesByThought[thoughtId] || [])
        .map(statusId => state.statuses[statusId])
        .filter(Boolean);
    }
    return [];
  }, [state.statuses, state.statusesByThought, thoughtId]);
  const handleClickHome = (): void => {
    history.push(homeUrl(history));
  };
  const handleUpdate = useCallback(async updatedThought => {
    await thoughtActions.editThought(db, updatedThought);
  }, []);
  const handleClickDelete = useCallback(() => {
    if (typeof thoughtId === 'string') {
      const onConfirm = async () => {
        await thoughtActions.deleteThought(db, thoughtId);
        history.push(homeUrl(history));
      };
  
      openConfirmation('Are you sure you want to delete this?', onConfirm);
    }
  }, [thoughtId]);
  const handleClickSettings = useCallback(() => {
    setDisplaySettings(prev => !prev);
    if (!displaySettings) {
      gearOpening(returnHomeSVGRef.current);
    } else {
      gearClosing(returnHomeSVGRef.current);
    }
  }, [thoughtId, displaySettings]);

  return (
    <div className={classes.root}>
      {!thought &&
        <Loading id={'thought-loader'}/>}
      {thought && 
        <ThoughtInformation
          classes={classes}
          thought={thought}
          tags={relatedTags}
          notes={relatedNotes}
          statusOptions={statusOptions}
          typeOptions={TYPE_OPTIONS}
          tagOptions={TAG_OPTIONS}
          priorityOptions={PRIORITY_OPTIONS}
          onUpdate={handleUpdate}
          onEditState={setEditState}
          editState={editState}
          stateNotes={state.notes}
          stateSettings={state.settings}
          statuses={statuses}
        />
      }
      <ThoughtSettings
        display={displaySettings}
        thought={thought}
        tags={relatedTags}
        notes={relatedNotes}
        onDelete={handleClickDelete}  
      />
      <CircleButton classes={classes} id={'return-home'} onClick={handleClickHome} label={'Return Home'} Icon={Home}/>
      {!editState && <CircleButton svgRef={returnHomeSVGRef} classes={classes} id={'settings'} onClick={handleClickSettings} label={'Settings'} Icon={Settings}/>}
      {editState && <CreateConnectionsFromThought classes={classes} thought={thought} thoughts={state.thoughts} connections={state.connections}/>}
    </div>
  );
};

const gearOpening = (element: HTMLElement): void => {
  element.classList.add('gear-opening');
};

const gearClosing = (element: HTMLElement): void => {
  element.classList.remove('gear-opening');
}

export default withStyles(styles)(Thought);
