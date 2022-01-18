import { Setting } from '../../store/rxdb/schemas/setting';
import SettingModel from '../../models/settings';
import { insert, remove, update } from '../../reducers/settings';
import { Notification, RxChangeEvent } from '../../types';
import { AppDispatch } from '~store';

export const handleSettingChange = (
  dispatch: AppDispatch,
  setLastNotification: (notification: Notification) => void,
) => ({ documentData, operation, previousDocumentData }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const setting: Setting = documentData;
  let notification;

  switch (operation) {
  case 'INSERT':
    dispatch(insert(SettingModel.parseSetting(setting)));
    notification = { message: 'Setting updated' };
    break;
    
  case 'DELETE':
    dispatch(remove(previousDocumentData.field));
    break;

  case 'UPDATE':
    dispatch(update(SettingModel.parseSetting(setting)));
    notification = { message: 'Setting updated' };
    break;
  
  default:
    break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
