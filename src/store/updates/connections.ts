import { Connection } from '../../store/rxdb/schemas/connection';
import { insert, remove, update } from '../../reducers/connections';
import { Notification, RxChangeEvent } from '../../types';
import { getInstance } from '../../hooks/useThoughtMap';
import { AppDispatch } from '~store';

const updateThoughtMap = async (from: string, to: string) => {
  const thoughtMap = await getInstance();
  await thoughtMap.removeConnection(from, to);
};

export const handleConnectionChange = (
  dispatch: AppDispatch,
  setLastNotification: (notification: Notification) => void,
) => ({ documentData, operation, documentId, previousDocumentData }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const connection: Connection = documentData;
  let notification;

  switch (operation) {
    case 'INSERT':
      dispatch(insert(connection));
      notification = { message: 'Connection created' };
      break;
    
    case 'DELETE':
      updateThoughtMap(previousDocumentData.from, previousDocumentData.to);
      dispatch(remove(documentId));
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
