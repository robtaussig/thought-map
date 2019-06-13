import React, { useMemo, useCallback, useState } from 'react';
import useApp from '../../hooks/useApp';
import { useLoadedDB } from '../../hooks/useDB';
import { withStyles } from '@material-ui/core/styles';
import Home from '@material-ui/icons/Home';
import Delete from '@material-ui/icons/Delete';
import { styles } from './styles';
import Loading from '../Loading';
import ThoughtInformation from './ThoughtInformation';
import CreateConnectionsFromThought from './components/CreateConnectionsFromThought';
import CircleButton from '../General/CircleButton';
import { thoughts as thoughtActions } from '../../actions';
import { openConfirmation } from '../../lib/util';

export const STATUS_OPTIONS = ['new', 'completed', 'in progress', 'almost done', 'pending'];
const TYPE_OPTIONS = ['Task', 'Todo', 'Reminder', 'Misc'];

export const Thought = ({ classes, state }) => {
  const db = useLoadedDB();
  const { history, dispatch } = useApp();
  const [editState, setEditState] = useState(false);
  const thoughtId = getThoughtIdFromPath(history.location.pathname);
  const thought = useMemo(() => state.thoughts.find(thought => thought.id === thoughtId), [thoughtId, state.thoughts]);
  const relatedTags = useMemo(() => Object.values(state.tags).filter(tag => tag.thoughtId === thoughtId), [thoughtId, state.tags]);
  const relatedNotes = useMemo(() => Object.values(state.notes).filter(note => note.thoughtId === thoughtId), [thoughtId, state.notes]);
  const handleClickHome = () => {
    history.push('/');
  };
  const handleUpdate = useCallback(async updatedThought => {
    await thoughtActions.editThought(db, updatedThought);
  }, []);
  const handleClickDelete = useCallback(() => {
    const onConfirm = async () => {
      await thoughtActions.deleteThought(db, thoughtId);
      history.push('/');
    };

    openConfirmation('Are you sure you want to delete this?', onConfirm);
  }, [thoughtId]);

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
          statusOptions={STATUS_OPTIONS}
          typeOptions={TYPE_OPTIONS}
          onUpdate={handleUpdate}
          onEditState={setEditState}
          editState={editState}
        />}
        {!editState && <CircleButton classes={classes} id={'return-home'} onClick={handleClickHome} label={'Return Home'} Icon={Home}/>}
        {!editState && <CircleButton classes={classes} id={'delete'} onClick={handleClickDelete} label={'Delete'} Icon={Delete}/>}
        {editState && <CreateConnectionsFromThought classes={classes} thought={thought}/>}
    </div>
  );
};

export default withStyles(styles)(Thought);

const getThoughtIdFromPath = path => {
  return path.split('/')[2];
};
