import React, { FC, useMemo } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { ConnectionSummary } from '../../../../';
import { useModalDynamicState } from '../../../../../../hooks/useModal';
import { AppState } from '../../../../../../reducers';
import AvailableThoughts from './AvailableThoughts';
import CurrentConnections from './CurrentConnections';

interface ConnectionsModalProps {
  classes: any,
  onClose: () => void;
  thoughtId: string;
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  currentConnections: {
    display: 'flex',
    flexDirection: 'column',
  },
  currentConnection: {
    display: 'flex',
  },
  currentConnectionTitle: {
    flex: 1,
    color: 'white',
  },
  deleteConnectionButton: {
    marginLeft: 5,
    color: theme.palette.red[500],
    ...theme.defaults.centered,
  },
  availableThoughts: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottom: '1px solid white',
  },
  noMatches: {

  },
  thoughtList: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  thoughtItem: {
    marginTop: 10,
    paddingBottom: 10,   
    color: 'white',
    '& button': {
      textAlign: 'left',
      fontWeight: 600,
      color: '#bada55',
      margin: '0 15px',
    },
    '&:not(:last-child)': {
      borderBottom: '1px solid white',
    },
  },
  inputLabel: {
    '&#filter-thoughts': {
      '& input': {
        width: '100%',
      },
    },
  },
  selectLabel: {
    '&#available-thoughts': {
      '& select': {
        width: '100%',
      },
    },
  },
});

export const ConnectionsModal: FC<ConnectionsModalProps> = ({ classes, onClose, thoughtId }) => {
  const state: AppState = useModalDynamicState();

  const connections: ConnectionSummary[] = useMemo(() =>
    Object.values(state.connections)
      .filter(({ to, from }) => {
        return to === thoughtId || from === thoughtId;
      })
      .map(({ id, to, from }) => {
        const otherThought = state.thoughts.find(({ id: otherThoughtId }) => otherThoughtId !== thoughtId && (otherThoughtId === to || otherThoughtId === from));
        return {
          isParent: otherThought.id === to,
          otherThought,
          connectionId: id,
        };
      })
  , [thoughtId, state.connections, state.thoughts]);

  const availableThoughts = useMemo(() => {
    const otherThoughtIds =
      connections
        .filter(({ isParent }) => isParent)
        .map(({ otherThought }) => otherThought.id);

    return state.thoughts
      .filter(({ id }) => !otherThoughtIds.includes(id) && id !== thoughtId);
  }, [state.thoughts, connections]);

  return (
    <div className={classes.root}>
      <AvailableThoughts
        classes={classes}
        thoughts={availableThoughts}
        thoughtId={thoughtId}
      />
      <CurrentConnections
        classes={classes}
        connections={connections}
      />
    </div>
  );
};

export default withStyles(styles)(ConnectionsModal);
