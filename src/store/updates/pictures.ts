import { Dispatch } from '@reduxjs/toolkit';
import { Picture } from '../../store/rxdb/schemas/picture';
import { insert, remove, update } from '../../reducers/pictures';
import { Notification, RxChangeEvent } from '../../types';

export const handlePictureChange = (
  dispatch: Dispatch<any>,
  setLastNotification: (notification: Notification) => void,
  matchPictureLocationIfEnabled: (picture: Picture) => void,
) => ({ documentData, operation }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const picture: Picture = documentData;
  let notification;

  switch (operation) {
    case 'INSERT':
      dispatch(insert(picture));
      matchPictureLocationIfEnabled(picture);
      notification = { message: 'Picture created' };
      break;
    
    case 'REMOVE':
      dispatch(remove(picture));
      notification = { message: 'Picture removed' };
      break;

    case 'UPDATE':
      dispatch(update(picture));
      notification = { message: 'Picture updated' };
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
