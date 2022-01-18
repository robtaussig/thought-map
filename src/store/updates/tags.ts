import { Tag } from '../../store/rxdb/schemas/tag';
import { insert, remove, update } from '../../reducers/tags';
import { Notification, RxChangeEvent } from '../../types';
import { searcherWorker } from '../init';
import { AppDispatch } from '~store';

export const handleTagChange = (
    dispatch: AppDispatch,
    setLastNotification: (notification: Notification) => void,
) => ({ documentData, operation, documentId }: RxChangeEvent) => {
    if ((window as any).blockDBSubscriptions === true) return;
    const tag: Tag = documentData;
    let notification;

    switch (operation) {
    case 'INSERT':
        dispatch(insert(tag));
        searcherWorker.buildTree(null, null, { [tag.id]: tag });
        notification = { message: 'Tag created' };
        break;
    
    case 'DELETE':
        dispatch(remove(documentId));
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
