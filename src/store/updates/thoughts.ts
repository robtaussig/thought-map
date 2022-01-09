import { Dispatch } from '@reduxjs/toolkit';
import { Thought } from '../../store/rxdb/schemas/thought';
import { insert, remove, update } from '../../reducers/thoughts';
import { Notification, RxChangeEvent } from '../../types';
import { getInstance } from '../../hooks/useThoughtMap';
import { searcherWorker } from '../init';

const updateThoughtMap = async (thoughtId: string) => {
  const thoughtMap = await getInstance();
  await thoughtMap.removeThought(thoughtId);
};

export const handleThoughtChange = (
  dispatch: Dispatch<any>,
  setLastNotification: (notification: Notification) => void,
) => ({ documentData, operation }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const thought: Thought = documentData;
  let notification;

  switch (operation) {
    case 'INSERT':
      dispatch(insert(thought));
      searcherWorker.buildTree([thought], null, null);
      notification = { message: 'Thought created' };
      break;
    
    case 'REMOVE':
      dispatch(remove(thought));
      updateThoughtMap(thought.id);
      searcherWorker.invalidate(thought.id);
      notification = { message: 'Thought removed' };
      break;

    case 'UPDATE':
      dispatch(update(thought));
      searcherWorker.invalidate(thought.id).then(() => {
        searcherWorker.buildTree([thought], null, null);
      })
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
