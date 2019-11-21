import { Dispatch } from '@reduxjs/toolkit';
import { Note } from '../../store/rxdb/schemas/note';
import { insert, remove, update } from '../../reducers/notes';
import { Notification, RxChangeEvent } from '../../types';

export const handleNoteChange = (
  dispatch: Dispatch<any>,
  setLastNotification: (notification: Notification) => void,
) => ({ data }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const note: Note = data.v;
  let notification;

  switch (data.op) {
    case 'INSERT':
      dispatch(insert(note));
      notification = { message: 'Note created' };
      break;
    
    case 'REMOVE':
      dispatch(remove(note));
      notification = { message: 'Note removed' };
      break;

    case 'UPDATE':
      dispatch(update(note));
      notification = { message: 'Note updated' };
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
