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
import { Picture } from '../../store/rxdb/schemas/picture';

export interface PriorityOption {
  value: number;
  label: string;
}

interface ThoughtProps {
  classes: any;
  state: AppState;
  statusOptions: string[];
  typeOptions: string[];
  tagOptions: string[];
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 0, label: 'NOT RELEVANT (HIDE)' },
  { value: 1, label: 'LOW' },
  { value: 5, label: 'MEDIUM' },
  { value: 10, label: 'HIGH' },
];

export const Thought: FC<ThoughtProps> = ({ classes, state, statusOptions, typeOptions, tagOptions }) => {
  
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
  const pinnedPictures: Picture[] = useMemo(() => {
    return Object.values(state.pictures).filter(picture => {
      return picture.pinned && picture.thoughtId === thoughtId;
    });
  }, [thoughtId, state.pictures]);
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
          typeOptions={typeOptions}
          tagOptions={tagOptions}
          priorityOptions={PRIORITY_OPTIONS}
          onUpdate={handleUpdate}
          onEditState={setEditState}
          editState={editState}
          stateNotes={state.notes}
          stateSettings={state.settings}
          statuses={statuses}
          pinnedPictures={pinnedPictures}
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
      {!editState && (
        <CircleButton
          svgRef={returnHomeSVGRef}
          classes={classes}
          id={'settings'}
          onClick={handleClickSettings}
          label={'Settings'}
          Icon={Settings}
        />
      )}
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
