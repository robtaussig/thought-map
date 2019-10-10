import React, { FC, useEffect, useMemo, Fragment } from 'react';
import { withStyles, StyleRules } from '@material-ui/core/styles';
import { thoughts as thoughtActions } from '../../../../actions';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { AppState } from '../../../../reducers';
import { Note } from '../../../../store/rxdb/schemas/note';
import { Tag } from '../../../../store/rxdb/schemas/tag';
import { useLoadedDB } from '../../../../hooks/useDB';
import { useModalDynamicState } from '../../../../hooks/useModal';
import Loading from '../../../Loading';
import {
  GoogleCalendarEvent,
} from './types';
import {
  generateStartFromThought,
  generateEndFromThought,
  generateDescriptionFromThought,
  generateRemindersFromThought,
} from './lib/util';
import useGoogleCalendar from '../../../../hooks/useGoogleCalendar';

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  error: {
    color: theme.palette.red[500],
  },
  errorHeader: {
    fontSize: 20,
    fontWeight: 600,
  },
  errorType: {
    fontWeight: 600,
  },
  header: {
    fontWeight: 600,
    fontSize: 20,
    marginBottom: 20,
  },
  createButton: {
    margin: '10px 0',
    padding: '5px 0',
    width: '70%',
    border: `1px solid ${theme.palette.secondary[700]}`,
    borderRadius: '7px',
    color: theme.palette.secondary[700],
  },
  viewEventButton: {
    margin: '10px 0',
    padding: '5px 0',
    width: '70%',
    border: `1px solid ${theme.palette.secondary[700]}`,
    borderRadius: '7px',
    color: theme.palette.secondary[700],
  },
});

interface AddToCalendarProps {
  classes: any;
  onClose: () => void;
  thoughtId: string;
  notes: Note[];
  tags: Tag[];
}

export const AddToCalendar: FC<AddToCalendarProps> = ({ classes, onClose, thoughtId, notes, tags }) => {
  const db = useLoadedDB();
  const state: AppState = useModalDynamicState();
  const thought = state.thoughts.find(el => el.id === thoughtId);
  const [signedIn, actions, error] = useGoogleCalendar();
  const gogleCalendarEvent: GoogleCalendarEvent = useMemo(() => ({
    kind: 'calendar#event',
    id: thought.id.replace(/-/g, ''),
    status: 'confirmed',
    summary: thought.title,
    description: generateDescriptionFromThought(thought),
    start: generateStartFromThought(thought),
    end: generateEndFromThought(thought),
    reminders: generateRemindersFromThought(thought),
  }), [thought, notes, tags]);

  const handleClickCreate = async () => {
    const event = await actions.createEvent(gogleCalendarEvent);
    await thoughtActions.editThought(db, {
      ...thought,
      calendarLink: event.result.htmlLink
    });
  };

  const handleClickViewEvent = () => {
    window.open(thought.calendarLink, '_blank');
  };

  if (error) {
    return (
      <div className={classes.error}>
        <h2 className={classes.errorHeader}>Error</h2>
        <h3 className={classes.errorType}>{error.error}</h3>
        {error.details || error.message}
      </div>
    );
  }

  return (
    <div className={classes.root}>
      {signedIn ? (
        <Fragment>
          <h2 className={classes.header}>Google Calendar</h2>
          <button className={classes.createButton} onClick={handleClickCreate}>Create</button>
          {thought.calendarLink && (
            <button className={classes.viewEventButton} onClick={handleClickViewEvent}>View Event</button>
          )}
        </Fragment>
      ) : (
        <Loading id={'calendar-loader'}/>
      )}
    </div>
  );
};

export default withStyles(styles)(AddToCalendar);
