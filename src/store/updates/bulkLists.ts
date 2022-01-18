import { Dispatch } from '@reduxjs/toolkit';
import { BulkList } from '../../store/rxdb/schemas/bulkList';
import { insert, remove, update } from '../../reducers/bulkLists';
import { Notification, RxChangeEvent } from '../../types';

export const handleBulkListChange = (
  dispatch: Dispatch<any>,
  setLastNotification: (notification: Notification) => void,
) => ({ documentData, operation, documentId }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const bulkList: BulkList = documentData;
  let notification;

  switch (operation) {
    case 'INSERT':
      dispatch(insert(bulkList));
      notification = { message: 'BulkList created' };
      break;
    
    case 'DELETE':
      dispatch(remove(documentId));
      notification = { message: 'BulkList removed' };
      break;

    case 'UPDATE':
      dispatch(update(bulkList));
      notification = { message: 'BulkList updated' };
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
