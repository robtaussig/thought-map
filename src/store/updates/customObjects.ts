import { Dispatch } from '@reduxjs/toolkit';
import { CustomObject } from '../../store/rxdb/schemas/customObject';
import { insert, remove, update } from '../../reducers/customObjects';
import { Notification, RxChangeEvent } from '../../types';

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

export const handleCustomObjectChange = (
  dispatch: Dispatch<any>,
  setLastNotification: (notification: Notification) => void,
) => ({ data }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const customObject: CustomObject = data.v;
  let notification;

  switch (data.op) {
    case 'INSERT':
      dispatch(insert(customObject));
      notification = { message: `${capitalize(customObject.type)} created` };
      break;
    
    case 'REMOVE':
      dispatch(remove(customObject));
      notification = { message: `${capitalize(customObject.type)} removed` };
      break;

    case 'UPDATE':
      dispatch(update(customObject));
      notification = { message: `${capitalize(customObject.type)} updated` };
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
