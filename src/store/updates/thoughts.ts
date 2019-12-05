import { Dispatch } from '@reduxjs/toolkit';
import { Thought } from '../../store/rxdb/schemas/thought';
import { insert, remove, update } from '../../reducers/thoughts';
import { Notification, RxChangeEvent } from '../../types';

export const handleThoughtChange = (
  dispatch: Dispatch<any>,
  setLastNotification: (notification: Notification) => void,
) => ({ data }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const thought: Thought = data.v;
  let notification;

  switch (data.op) {
    case 'INSERT':
      dispatch(insert(thought));
      notification = { message: 'Thought created' };
      break;
    
    case 'REMOVE':
      dispatch(remove(thought));
      notification = { message: 'Thought removed' };
      break;

    case 'UPDATE':
      dispatch(update(thought));      
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
