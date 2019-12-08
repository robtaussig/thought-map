import { Dispatch } from '@reduxjs/toolkit';
import { Connection } from '../../store/rxdb/schemas/connection';
import { insert, remove, update } from '../../reducers/connections';
import { Notification, RxChangeEvent } from '../../types';
import { getInstance } from '../../hooks/useThoughtMap';

const updateThoughtMap = async (from: string, to: string) => {
  const thoughtMap = await getInstance();
  await thoughtMap.removeConnection(from, to);
};

export const handleConnectionChange = (
  dispatch: Dispatch<any>,
  setLastNotification: (notification: Notification) => void,
) => ({ data }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const connection: Connection = data.v;
  let notification;

  switch (data.op) {
    case 'INSERT':
      dispatch(insert(connection));
      notification = { message: 'Connection created' };
      break;
    
    case 'REMOVE':
      updateThoughtMap(connection.from, connection.to);
      dispatch(remove(connection));
      notification = { message: 'Connection removed' };
      break;

    case 'UPDATE':
      dispatch(update(connection));
      notification = { message: 'Connection updated' };
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
