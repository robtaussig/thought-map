import { Dispatch } from '@reduxjs/toolkit';
import { Template } from '../../store/rxdb/schemas/template';
import { insert, remove, update } from '../../reducers/templates';
import { Notification, RxChangeEvent } from '../../types';

export const handleTemplateChange = (
  dispatch: Dispatch<any>,
  setLastNotification: (notification: Notification) => void,
) => ({ data }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const template: Template = data.v;
  let notification;

  switch (data.op) {
    case 'INSERT':
      dispatch(insert(template));
      notification = { message: 'Template created' };
      break;
    
    case 'REMOVE':
      dispatch(remove(template));
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
