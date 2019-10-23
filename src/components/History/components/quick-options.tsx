import React, { FC } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { Group, StatusUpdate } from '../types';
import { useModalDynamicState } from '../../../hooks/useModal';
import { useLoadedDB } from '../../../hooks/useDB';
import { AppState } from '../../../reducers';
import { statuses as statusActions } from '../../../actions';

interface PartQuickOptionsProps {
  classes: any;
  group: Group;
  part: StatusUpdate;
  statusOptions: string[];
  onClose: () => void;
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  thoughtTitle: {
    fontWeight: 600,
    fontSize: 16,
  },
  bumpButton: {
    fontWeight: 600,
    color: theme.palette.secondary[700],
    marginTop: 20,
    border: `1px solid ${theme.palette.secondary[700]}`,
    padding: '5px 12px',
    borderRadius: '5px',
    '&:disabled': {
      color: 'gray',
      border: '1px solid gray',
    },
  },
});

export const PartQuickOptions: FC<PartQuickOptionsProps> = ({ classes, group, part, onClose, statusOptions }) => {
  const state: AppState = useModalDynamicState();
  const db = useLoadedDB();
  const status = state.statuses[part.statusId];
  const thought = state.thoughts.find(({ id }) => id === part.thoughtId);

  const handleClickBumpStatus = () => {
    const nextStatusUpdate = group[group.length - 1];
    const statusIndex = statusOptions.indexOf(nextStatusUpdate.status);
    const nextStatus = statusOptions[statusIndex + 1];
    statusActions.createStatus(db, {
      thoughtId: part.thoughtId,
      text: nextStatus,
    });
    onClose();
  };

  return (
    <div className={classes.root}>
      <h1 className={classes.thoughtTitle}>[{status.text}] - {thought.title}</h1>
      <button className={classes.bumpButton}
        disabled={thought.status === 'completed'}
        onClick={handleClickBumpStatus}
      >
        Bump status
      </button>
    </div>
  );
};

export default withStyles(styles)(PartQuickOptions);
