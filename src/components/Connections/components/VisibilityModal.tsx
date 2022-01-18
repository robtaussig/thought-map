import React, { FC, useState } from 'react';
import { StyleRules, withStyles } from '@material-ui/styles';
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
    margin: '10px 0',
  },
  updateButton: () => ({
    flex: 0,
    backgroundColor: theme.palette.secondary[500],
    color: theme.palette.background[100],
    padding: '5px 10px',
    borderRadius: 5,
    marginLeft: 20,
  }),
  bumpButton: () => ({
    backgroundColor: theme.palette.secondary[500],
    color: theme.palette.background[100],
    padding: '5px 0',
    borderRadius: 5,
    width: '100%',
    marginTop: 25,
  }),
});

export const VisibilityModal: FC<VisibilityModalProps> = ({ classes, thought, onClose }) => {
  const { db } = useLoadedDB();
  const [priority, setPriority] = useState<number>(thought.priority);
  const [goalPoints, setGoalPoints] = useState<number>(thought.goalPoints);

  const handleChangePriority = (event: any) => {
    setPriority(Number(event.target.value));
  };

  const handleSubmitPriority = (event: any) => {
    event.preventDefault();
    thoughtActions.editThought(db, {
      ...thought,
      priority,
    });
  };

  const handleChangeGoalPoints = (event: any) => {
    setGoalPoints(Number(event.target.value));
  };

  const handleSubmitGoalPoints = (event: any) => {
    event.preventDefault();
    thoughtActions.editThought(db, {
      ...thought,
      goalPoints,
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
        onSubmit={handleSubmitPriority}
      >
        <Range
          classes={classes}
          name={'Priority'}
          label={'Priority'}
          value={priority}
          min={0}
          max={10}
          onChange={handleChangePriority}
        />
        <button
          className={classes.updateButton}
        >
          Update
        </button>
      </form>
      <form
        className={classes.rangeForm}
        onSubmit={handleSubmitGoalPoints}
      >
        <Range
          classes={classes}
          name={'Goal Points'}
          label={'Goal Points'}
          value={goalPoints}
          min={0}
          max={10}
          onChange={handleChangeGoalPoints}
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
