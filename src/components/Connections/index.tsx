import React, { FC, useMemo } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { AppState } from '../../reducers';
import useApp from '../../hooks/useApp';
import { getIdFromUrl } from '../../lib/util';
import ConnectionGraph from './components/ConnectionGraph';

interface ConnectionsProps {
  classes: any;
  state: AppState;
}

const styles = (theme: any): StyleRules => ({
  root: {

  },
});

export const Connections: FC<ConnectionsProps> = ({ classes, state }) => {
  const { history } = useApp();

  const thoughtId = getIdFromUrl(history, 'thought');
  const thought = useMemo(() => state.thoughts.find(thought => thought.id === thoughtId), [thoughtId, state.thoughts]);

  return (
    <div className={classes.root}>
      <h1>Connections</h1>
      <ConnectionGraph thought={thought} thoughts={state.thoughts} connections={state.connections}/>
    </div>
  );
};

export default withStyles(styles)(Connections);
