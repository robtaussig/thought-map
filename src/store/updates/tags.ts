import { Dispatch } from '@reduxjs/toolkit';
import { Tag } from '../../store/rxdb/schemas/tag';
import { insert, remove, update } from '../../reducers/tags';
import { Notification, RxChangeEvent } from '../../types';
import { searcherWorker } from '../init';

export const handleTagChange = (
  dispatch: Dispatch<any>,
  setLastNotification: (notification: Notification) => void,
) => ({ data }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const tag: Tag = data.v;
  let notification;

  switch (data.op) {
    case 'INSERT':
      dispatch(insert(tag));
      searcherWorker.buildTree(null, null, { [tag.id]: tag });
      notification = { message: 'Tag created' };
      break;
    
    case 'REMOVE':
      dispatch(remove(tag));
      searcherWorker.invalidate(tag.id);
      notification = { message: 'Tag removed' };
      break;

    case 'UPDATE':
      dispatch(update(tag));
      searcherWorker.invalidate(tag.id).then(() => {
        searcherWorker.buildTree(null, null, { [tag.id]: tag });
      });
      notification = { message: 'Tag updated' };
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
