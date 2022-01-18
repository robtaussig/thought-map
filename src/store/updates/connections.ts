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
) => ({ documentData, operation, documentId }: RxChangeEvent) => {
    if ((window as any).blockDBSubscriptions === true) return;
    const connection: Connection = documentData;
    let notification;

    switch (operation) {
    case 'INSERT':
        dispatch(insert(connection));
        notification = { message: 'Connection created' };
        break;
    
    case 'DELETE':
        updateThoughtMap(connection.from, connection.to);
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
