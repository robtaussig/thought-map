import { Plan } from '../../store/rxdb/schemas/plan';
import { insert, remove, update } from '../../reducers/plans';
import { Notification, RxChangeEvent } from '../../types';
import { AppDispatch } from '../../store';

export const handlePlanChange = (
  dispatch: AppDispatch,
  setLastNotification: (notification: Notification) => void,
) => ({ documentData, operation, documentId }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const plan: Plan = documentData;
  let notification;

  switch (operation) {
    case 'INSERT':
      dispatch(insert(plan));
      notification = { message: 'Plan created' };
      break;
    
    case 'DELETE':
      dispatch(remove(documentId));
      notification = { message: 'Plan removed' };
      break;

    case 'UPDATE':
      dispatch(update(plan));
      notification = { message: 'Plan updated' };
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
