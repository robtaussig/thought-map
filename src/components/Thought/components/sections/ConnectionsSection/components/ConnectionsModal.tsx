import React, { FC, useMemo } from 'react';
import { StyleRules, withStyles } from '@material-ui/styles';
import { ConnectionSummary } from '../../../../';
import { Plan } from '../../../../../../store/rxdb/schemas/plan';
import AvailableThoughts from './AvailableThoughts';
import CurrentConnections from './CurrentConnections';
import { useSelector } from 'react-redux';
import { thoughtSelector } from '../../../../../../reducers/thoughts';
import { planSelector } from '../../../../../../reducers/plans';
import { connectionSelector } from '../../../../../../reducers/connections';
import { useTypedSelector } from '../../../../../../reducers';

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
    overflow: 'auto',
    '& > label': {
      marginBottom: 5,
    },
  },
  currentConnections: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'auto',
  },
  currentConnection: {
    display: 'flex',
  },
  currentConnectionTitle: () => ({
    flex: 1,
    color: theme.palette.secondary[700],
  }),
  deleteConnectionButton: () => ({
    marginLeft: 5,
    color: theme.palette.negative[500],
    ...theme.defaults.centered,
  }),
  noMatches: {

  },
  thoughtList: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  thoughtItem: () => ({
    marginTop: 10,
    paddingBottom: 10,
    color: theme.palette.secondary[700],
    display: 'flex',
    flexDirection: 'column',
    '&:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.secondary[700]}`,
    },
  }),
  buttonsDivider: {
    margin: '0 15px',
  },
  buttonsWrapper: () => ({
    marginTop: 10,
    '& button': {
      fontWeight: 600,
      color: theme.palette.secondary[500],
    },
  }),
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
  submitButton: () => ({
    flex: '0 0 20px',
    marginLeft: 5,
    color: theme.palette.background[200],
    backgroundColor: theme.palette.secondary[500],
    borderRadius: 5,
    height: 20,
    '& > svg': {
      height: 20,
      width: 20,
    },
    '&:disabled': {
      backgroundColor: theme.palette.background[400],
    },
  }),
  selectLabel: {
    '&#available-thoughts': {
      '& select': {
        width: '100%',
      },
    },
  },
});

export const ConnectionsModal: FC<ConnectionsModalProps> = ({ classes, onClose, thoughtId, autoFocus }) => {
  const normalizedThoughts = useTypedSelector(thoughtSelector.selectEntities);
  const thoughts = useTypedSelector(thoughtSelector.selectAll);
  const plans = useSelector(planSelector);
  const stateConnections = useSelector(connectionSelector);

  const thought = normalizedThoughts[thoughtId];
  const plan: Plan = plans.find(({ id }) => thought.planId === id);
  const connections: ConnectionSummary[] = useMemo(() =>
    Object.values(stateConnections)
      .filter(({ to, from }) => {
        return to === thoughtId || from === thoughtId;
      })
      .map(({ id, to, from }) => {
        const otherThought = normalizedThoughts[to === thoughtId ? from : to];
        return {
          isParent: otherThought.id === to,
          otherThought,
          connectionId: id,
        };
      })
  , [thoughtId, stateConnections, normalizedThoughts]);

  const availableThoughts = useMemo(() => {
    const otherThoughtIds =
      connections
        .map(({ otherThought }) => otherThought.id);

    return thoughts
      .filter(({ id }) => !otherThoughtIds.includes(id) && id !== thoughtId);
  }, [thoughts, connections]);

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
