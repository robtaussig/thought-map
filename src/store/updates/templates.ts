import { Template } from '../../store/rxdb/schemas/template';
import { insert, remove, update } from '../../reducers/templates';
import { Notification, RxChangeEvent } from '../../types';
import { AppDispatch } from '../../store';

export const handleTemplateChange = (
  dispatch: AppDispatch,
  setLastNotification: (notification: Notification) => void,
) => ({ documentData, operation, documentId }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const template: Template = documentData;
  let notification;

  switch (operation) {
    case 'INSERT':
      dispatch(insert(template));
      notification = { message: 'Template created' };
      break;
    
    case 'DELETE':
      dispatch(remove(documentId));
      notification = { message: 'Template removed' };
      break;

    case 'UPDATE':
      dispatch(update(template));
      notification = { message: 'Template updated' };
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
