import React, { FC, useEffect, useMemo } from 'react';
import { thoughts as thoughtActions } from '../../../../actions';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { Note } from '../../../../store/rxdb/schemas/note';
import { Tag } from '../../../../store/rxdb/schemas/tag';
import { useLoadedDB } from '../../../../hooks/useDB';
import ApiCalendar from 'react-google-calendar-api';
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

interface AddToCalendarProps {
  classes: any;
  onClose: () => void;
  thought: Thought;
  notes: Note[];
  tags: Tag[];
}

export const AddToCalendar: FC<AddToCalendarProps> = ({ classes, onClose, thought, notes, tags }) => {
  const db = useLoadedDB();

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

  useEffect(() => {
    const addToCalendar = async () => {
      if (!thought.calendarLink) {
        const event = await ApiCalendar.createEvent(gogleCalendarEvent);
        await thoughtActions.editThought(db, {
          ...thought,
          calendarLink: event.result.htmlLink
        });
        onClose();
      } else {
        alert('Already created a calendar event for this thought');
      }
    };
  
    const handleSignInChange = (sign: boolean) => {
      if (sign) {
        addToCalendar();
      }
    };
  
    ApiCalendar.onLoad(() => {
      ApiCalendar.listenSign(handleSignInChange);
    });

    if (!ApiCalendar.sign) {
      ApiCalendar.handleAuthClick();
    } else {
      addToCalendar();
    }
  }, []);

  return (
    <div className={classes.addToCalendar}>
      <Loading id={'calendar-loader'}/>
    </div>
  );
};

export default AddToCalendar;
