import React, { FC, useState } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { Thought } from '../../../store/rxdb/schemas/thought';
import Range from '../../General/Range';
import { useLoadedDB } from '../../../hooks/useDB';
import { thoughts as thoughtActions } from '../../../actions';

interface VisibilityModalProps {
  classes: any;
  thought: Thought;
  onClose: () => void;
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  rangeLabel: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  rangeForm: {
    display: 'flex',
  },
  updateButton: {
    flex: 0,
    backgroundColor: theme.palette.secondary[500],
    color: theme.palette.gray[100],
    padding: '5px 10px',
    borderRadius: 5,
    marginLeft: 20,
  },
  bumpButton: {
    backgroundColor: theme.palette.secondary[500],
    color: theme.palette.gray[100],
    padding: '5px 0',
    borderRadius: 5,
    width: '100%',
    marginTop: 25,
  },
});

export const VisibilityModal: FC<VisibilityModalProps> = ({ classes, thought, onClose }) => {
  const db = useLoadedDB();
  const [priority, setPriority] = useState<number>(thought.priority);
  const handleChangeRange = (event: any) => {
    setPriority(Number(event.target.value));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    thoughtActions.editThought(db, {
      ...thought,
      priority,
    });
  };
  
  const handleClickBump = () => {
    thoughtActions.editThought(db, {
      ...thought,
    });
  };

  return (
    <div className={classes.root}>
      <form
        className={classes.rangeForm}
        onSubmit={handleSubmit}
      >
        <Range
          classes={classes}
          name={'Priority'}
          label={'Priority'}
          value={priority}
          min={0}
          max={10}
          onChange={handleChangeRange}
        />
        <button
          className={classes.updateButton}
        >
          Update
        </button>
      </form>
      <button className={classes.bumpButton} onClick={handleClickBump}>Bump</button>
    </div>
  );
};

export default withStyles(styles)(VisibilityModal);
