import { Dispatch } from '@reduxjs/toolkit';
import { Backup } from '../../store/rxdb/schemas/backup';
import { insert, remove, update } from '../../reducers/backups';
import { Notification, RxChangeEvent } from '../../types';

export const handleBackupChange = (
  dispatch: Dispatch<any>,
  setLastNotification: (notification: Notification) => void,
) => ({ documentData, operation, documentId }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const backup: Backup = documentData;
  let notification;

  switch (operation) {
    case 'INSERT':
      dispatch(insert(backup));
      notification = { message: 'Backup created' };
      break;
    
    case 'DELETE':
      dispatch(remove(documentId));
      notification = { message: 'Backup removed' };
      break;

    case 'UPDATE':
      dispatch(update(backup));
      notification = { message: 'Backup updated' };
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
