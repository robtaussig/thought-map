import { Dispatch } from '@reduxjs/toolkit';
import { Status } from '../../store/rxdb/schemas/status';
import { insert, remove, update } from '../../reducers/statuses';
import { updateStatus as updateThoughtStatus } from '../../reducers/thoughts';
import { insert as insertStatusByThought, remove as removeStatusByThought } from '../../reducers/statusesByThought';
import { Notification, RxChangeEvent } from '../../types';

export const handleStatusChange = (
  dispatch: Dispatch<any>,
  setLastNotification: (notification: Notification) => void,
  matchStatusLocationIfEnabled: (status: Status) => Promise<void>,
  handleRecurringThought: (thoughtId: string) => Promise<void>,
) => ({ data }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const status: Status = data.v;
  let notification;

  switch (data.op) {
    case 'INSERT':
      dispatch(insert(status));
      dispatch(insertStatusByThought(status));
      dispatch(updateThoughtStatus(status));
      matchStatusLocationIfEnabled(status);
      if (status.text === 'completed') {
        handleRecurringThought(status.thoughtId);
      }
      break;
    
    case 'REMOVE':
      dispatch(remove(status));
      dispatch(removeStatusByThought(status));
      break;

    case 'UPDATE':
      dispatch(update(status));
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
