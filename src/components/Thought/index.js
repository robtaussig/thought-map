import React, { useMemo } from 'react';
import useApp from '../../hooks/useApp'
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import Loading from '../Loading';
import ThoughtInformation from './ThoughtInformation';

export const Thought = ({ classes, state }) => {
  const { history, dispatch } = useApp();
  const thoughtId = useMemo(() => getThoughtIdFromPath(history.location.pathname), [history.location.pathname]);
  const thought = useMemo(() => state.thoughts.find(thought => thought.id === thoughtId), [thoughtId, state.thoughts]);
  const relatedTags = useMemo(() => Object.values(state.tags).filter(tag => tag.thoughtId === thoughtId), [thoughtId, state.tags]);
  const relatedNotes = useMemo(() => Object.values(state.notes).filter(note => note.thoughtId === thoughtId), [thoughtId, state.notes]);
  
  return (
    <div className={classes.root}>
      {!thought &&
        <Loading id={'thought-loader'}/>}
      {thought && 
        <ThoughtInformation classes={classes} thought={thought}/>}
    </div>
  );
};

export default withStyles(styles)(Thought);

const getThoughtIdFromPath = path => {
  return Number(path.split('/')[2]);
};
