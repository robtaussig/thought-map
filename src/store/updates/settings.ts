import { Dispatch } from '@reduxjs/toolkit';
import { Setting } from '../../store/rxdb/schemas/setting';
import SettingModel from '../../models/settings';
import { insert, remove, update } from '../../reducers/settings';
import { Notification, RxChangeEvent } from '../../types';

export const handleSettingChange = (
  dispatch: Dispatch<any>,
  setLastNotification: (notification: Notification) => void,
) => ({ data }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const setting: Setting = data.v;
  let notification;

  switch (data.op) {
    case 'INSERT':
      dispatch(insert(SettingModel.parseSetting(setting)));
      notification = { message: 'Setting updated' };
      break;
    
    case 'REMOVE':
      dispatch(remove(setting));
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
