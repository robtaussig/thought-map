import React, { FC, useEffect, useMemo } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { Thought } from '../../../store/rxdb/schemas/thought';
import classNames from 'classnames';
import { useLoadedDB } from '../../../hooks/useDB';
import { useModalDynamicState } from '../../../hooks/useModal';
import useApp from '../../../hooks/useApp';
import { thoughts as thoughtActions } from '../../../actions';
import { AppState } from '../../../reducers';
import { openConfirmation, homeUrl } from '../../../lib/util';

interface ThoughtNodeSettingsProps {
  classes: any,
  thought: Thought;
  onClose: () => void;
  onLoad: () => void;
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    userSelect: 'none',
  },
  title: {
    marginBottom: 20,
    fontWeight: 600,
    fontSize: 20,
  },
  button: {
    margin: '10px 0',
    padding: '5px 15px',
    width: '70%',
    borderRadius: '5px',
    color: theme.palette.secondary[700],
    fontWeight: 600,
    border: `1px solid ${theme.palette.secondary[700]}`,
    transition: 'all 0.3s linear',
    '&.delete': {
      color: theme.palette.red[500],
      border: `1px solid ${theme.palette.red[500]}`,
    },
    '&:active': {
      color: theme.palette.gray[200],
      backgroundColor: theme.palette.secondary[700],
      '&.delete': {
        color: theme.palette.gray[200],
        backgroundColor: theme.palette.red[500],
      },
    },
  },
});

export const ThoughtNodeSettings: FC<ThoughtNodeSettingsProps> = ({ classes, thought, onClose, onLoad }) => {
  const db = useLoadedDB();
  const state: AppState = useModalDynamicState();
  const { history } = useApp();

  useEffect(() => {
    onLoad();
  }, []);

  const handleClickBump = () => {
    onClose();
    thoughtActions.editThought(db, {
      ...thought
    });
  };

  const handleClickDelete = () => {
    openConfirmation('Are you sure you want to delete this thought?', () => {
      thoughtActions.deleteThought(db, thought.id);
      onClose();
    });
  };

  const handleClickViewConnections = () => {
    onClose();
    history.push(`${homeUrl(history)}thought/${thought.id}/connections`);
  };

  const hasConnections = useMemo(() => {
    return Object.values(state.connections).some(({ from, to }) => [from, to].includes(thought.id));
  }, [state.connections, thought]);

  return (
    <div className={classes.root}>
      <h1 className={classes.title}>{thought.title}</h1>
      <button className={classes.button} onClick={handleClickBump}>Bump</button>
      <button className={classes.button}>View History</button>
      {hasConnections && <button className={classes.button} onClick={handleClickViewConnections}>View Connections</button>}
      <button className={classNames(classes.button, 'delete')} onClick={handleClickDelete}>Delete</button>
    </div>
  );
};

export default withStyles(styles)(ThoughtNodeSettings);
