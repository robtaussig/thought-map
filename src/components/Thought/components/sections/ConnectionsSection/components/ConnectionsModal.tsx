import React, { FC, useMemo } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { ConnectionSummary } from '../../../../';
import { useModalDynamicState } from '../../../../../../hooks/useModal';
import { AppState } from '../../../../../../reducers';
import { Plan } from '../../../../../../store/rxdb/schemas/plan';
import AvailableThoughts from './AvailableThoughts';
import CurrentConnections from './CurrentConnections';

interface ConnectionsModalProps {
  classes: any,
  onClose: () => void;
  thoughtId: string;
  autoFocus?: boolean;
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
    color: theme.palette.secondary[700],
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
    borderBottom: `1px solid ${theme.palette.secondary[700]}`,
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
    color: theme.palette.secondary[700],
    display: 'flex',
    flexDirection: 'column',
    '&:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.secondary[700]}`,
    },
  },
  buttonsDivider: {
    margin: '0 15px',
  },
  buttonsWrapper: {
    marginTop: 10,
    '& button': {
      fontWeight: 600,
      color: theme.palette.secondary[500],
    },
  },
  inputLabel: {
    '&#filter-thoughts': {
      display: 'flex',
      alignItems: 'center',
      '& input': {
        width: '100%',
        flex: 1,
      },
    },
  },
  submitButton: {
    flex: '0 0 20px',
    marginLeft: 5,
    color: theme.palette.gray[200],
    backgroundColor: theme.palette.secondary[500],
    borderRadius: 5,
    height: 20,
    '& > svg': {
      height: 20,
      width: 20,
    },
    '&:disabled': {
      backgroundColor: theme.palette.gray[400],
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

export const ConnectionsModal: FC<ConnectionsModalProps> = ({ classes, onClose, thoughtId, autoFocus }) => {
  const state: AppState = useModalDynamicState();
  const thought = state.thoughts.find(({ id }) => id === thoughtId);
  const plan: Plan = state.plans.find(({ id }) => thought.planId === id);
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
        plan={plan}
        onCreate={onClose}
        autoFocus={autoFocus}
      />
      <CurrentConnections
        classes={classes}
        connections={connections}
      />
    </div>
  );
};

export default withStyles(styles)(ConnectionsModal);
