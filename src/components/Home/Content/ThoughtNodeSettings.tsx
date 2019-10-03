import React, { FC, useEffect } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';
import { Thought } from '../../../store/rxdb/schemas/thought';
import classNames from 'classnames';

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

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div className={classes.root}>
      <button className={classes.button}>Bump</button>
      <button className={classes.button}>View History</button>
      <button className={classes.button}>View Connections</button>
      <button className={classNames(classes.button, 'delete')}>Delete</button>
    </div>
  );
};

export default withStyles(styles)(ThoughtNodeSettings);
