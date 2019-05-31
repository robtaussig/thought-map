import React, { useMemo, useCallback } from 'react';
import useApp from '../../hooks/useApp'
import { withStyles } from '@material-ui/core/styles';
import Home from '@material-ui/icons/Home';
import { styles } from './styles';
import Loading from '../Loading';
import ThoughtInformation from './ThoughtInformation';
import AddButton from '../Home/AddButton';
import { thoughts as thoughtActions } from '../../actions';
import { useNestedXReducer } from '../../hooks/useXReducer';

const STATUS_OPTIONS = ['new', 'completed', 'in progress', 'almost done', 'pending'];

export const Thought = ({ classes, state }) => {
  const { history, dispatch } = useApp();
  const [_, setThoughts] = useNestedXReducer('thoughts', state, dispatch);
  const thoughtId = useMemo(() => getThoughtIdFromPath(history.location.pathname), [history.location.pathname]);
  const thought = useMemo(() => state.thoughts.find(thought => thought.id === thoughtId), [thoughtId, state.thoughts]);
  const relatedTags = useMemo(() => Object.values(state.tags).filter(tag => tag.thoughtId === thoughtId), [thoughtId, state.tags]);
  const relatedNotes = useMemo(() => Object.values(state.notes).filter(note => note.thoughtId === thoughtId), [thoughtId, state.notes]);
  console.log(state);
  const handleClickHome = () => {
    history.push('/');
  };
  const handleStatusChange = useCallback(async value => {
    const updatedThought = await thoughtActions.editThought({
      ...thought,
      status: value,
    });

    setThoughts(prev => prev.map(prevThought => prevThought.id === updatedThought.id ? updatedThought : prevThought));
  }, [thought]);

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
          onStatusChange={handleStatusChange}
        />}
        <AddButton classes={classes} id={'return-home'} onClick={handleClickHome} label={'Return Home'} Icon={Home}/>
    </div>
  );
};

export default withStyles(styles)(Thought);

const getThoughtIdFromPath = path => {
  return Number(path.split('/')[2]);
};
