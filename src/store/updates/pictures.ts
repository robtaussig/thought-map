import { Picture } from '../../store/rxdb/schemas/picture';
import { insert, remove, update } from '../../reducers/pictures';
import { Notification, RxChangeEvent } from '../../types';
import { AppDispatch } from '../../store';

export const handlePictureChange =
  (
    dispatch: AppDispatch,
    setLastNotification: (notification: Notification) => void,
    matchPictureLocationIfEnabled: (picture: Picture) => void
  ) =>
    ({ documentData, operation, documentId }: RxChangeEvent) => {
      if ((window as any).blockDBSubscriptions === true) return;
      let notification;

      switch (operation) {
        case 'INSERT':
          dispatch(insert(documentData));
          matchPictureLocationIfEnabled(documentData);
          notification = { message: 'Picture created' };
          break;

        case 'DELETE':
          dispatch(remove(documentId));
          notification = { message: 'Picture removed' };
          break;

        case 'UPDATE':
          dispatch(update(documentData));
          notification = { message: 'Picture updated' };
          break;

        default:
          break;
      }

      if ((window as any).blockNotifications) return;
      setLastNotification(notification);
    };
