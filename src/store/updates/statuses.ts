import { Status } from '../../store/rxdb/schemas/status';
import { insert, remove, update } from '../../reducers/statuses';
import { Notification, RxChangeEvent } from '../../types';
import { AppDispatch } from '~store';

export const handleStatusChange = (
    dispatch: AppDispatch,
    setLastNotification: (notification: Notification) => void,
    matchStatusLocationIfEnabled: (status: Status) => Promise<void>,
    handleRecurringThought: (thoughtId: string) => Promise<void>,
) => ({ documentData, operation, documentId }: RxChangeEvent) => {
    if ((window as any).blockDBSubscriptions === true) return;
    const status: Status = documentData;
    let notification;

    switch (operation) {
    case 'INSERT':
        dispatch(insert(status));
        matchStatusLocationIfEnabled(status);
        if (status.text === 'completed') {
            handleRecurringThought(status.thoughtId);
        }
        notification = { message: 'Thought updated' };
        break;
    
    case 'DELETE':
        dispatch(remove(documentId));
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
