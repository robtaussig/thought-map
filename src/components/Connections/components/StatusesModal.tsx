import React, { FC } from 'react';
import { StyleRules, withStyles } from '@material-ui/styles';
import Select from '../../General/Select';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { useLoadedDB } from '../../../hooks/useDB';
import { statuses as statusActions } from '../../../actions';

interface StatusesModalProps {
  classes: any;
  onClose: () => void;
  thought: Thought;
  statusOptions: string[];
}

const styles = (theme: any): StyleRules => ({
  root: {

  },
  selectLabel: () => ({
    '&#statuses': {
      '& select': {
        width: '100%',
        padding: 12,
        fontSize: 18,
        backgroundColor: theme.palette.secondary[500],
        color: theme.palette.background[100],
      },
    },
  }),
});

export const StatusesModal: FC<StatusesModalProps> = ({ classes, onClose, thought, statusOptions }) => {
  const { db } = useLoadedDB();
  const handleSelectStatus = (event: any) => {
    if (event.target.value !== thought.status) {
      statusActions.createStatus(db, {
        thoughtId: thought.id,
        text: event.target.value,
      });
      onClose();
    }
  };

  return (
    <div className={classes.root}>
      <Select
        classes={classes}
        id={'statuses'}
        value={thought.status}
        options={statusOptions}
        onChange={handleSelectStatus}
      />
    </div>
  );
};

export default withStyles(styles)(StatusesModal);
