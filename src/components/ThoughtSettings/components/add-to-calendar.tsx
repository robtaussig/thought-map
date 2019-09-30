import React, { FC, useEffect } from 'react';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { Note } from '../../../store/rxdb/schemas/note';
import { Tag } from '../../../store/rxdb/schemas/tag';
import ApiCalendar from 'react-google-calendar-api';

interface AddToCalendarProps {
  classes: any;
  onClose: () => void;
  thought: Thought;
  notes: Note[];
  tags: Tag[];
}

export const AddToCalendar: FC<AddToCalendarProps> = ({ classes, onClose, thought, notes, tags }) => {

  useEffect(() => {
    const addToCalendar = () => {
      alert('adding');
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

    </div>
  );
};

export default AddToCalendar;
