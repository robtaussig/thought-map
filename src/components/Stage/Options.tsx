import React, { FC, memo } from 'react';
import { makeStyles } from '@material-ui/styles';
import cn from 'classnames';
import { Thought } from '../../store/rxdb/schemas/thought';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import ArrowRight from '@material-ui/icons/ArrowRight';
import { useLoadedDB } from '../../hooks/useDB';
import { statuses as statusActions, thoughts as thoughtActions } from '../../actions';
import { useHomeUrl } from '../../lib/util';

const useStyles = makeStyles((_theme: any) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 20,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 8,
  },
  button: {
    marginBottom: 10,
  }
}));

export interface OptionsProps {
  className?: string;
  thought: Thought;
  onRequestClose: () => void;
  onRemove: () => void;
}

export const Options: FC<OptionsProps> = ({
  className,
  thought,
  onRequestClose,
  onRemove,
}) => {
  const classes = useStyles();
  const { db } = useLoadedDB();
  const homeUrl = useHomeUrl();

  const handleUnstage = async () => {
    await thoughtActions.editThought(db, {
      ...thought,
      stagedOn: '',
    });
    onRemove();
    onRequestClose();
  };

  const handleMarkComplete = async () => {
    await statusActions.createStatus(db, {
      text: 'Complete',
      thoughtId: thought.id,
    });
    onRemove();
    onRequestClose();
  };

  return (
    <div className={cn(classes.root, className)}>
      <Link
        className={cn(classes.header, classes.link)}
        to={`${homeUrl}thought/${thought.id}`}
        onClick={onRequestClose}
      >
        {thought.title}<ArrowRight/>
      </Link>
      <Button
        className={classes.button}
        variant="contained"
        onClick={handleUnstage}
      >
        Unstage
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        onClick={handleMarkComplete}
      >
        Mark Complete
      </Button>
    </div>
  );
};

export default memo(Options);
