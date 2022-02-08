import { Participant } from '../../store/rxdb/schemas/participant';
import { insert, remove, update } from '../../reducers/participants';
import { Notification, RxChangeEvent } from '../../types';
import { searcherWorker } from '../init';
import { AppDispatch } from '../../store';

export const handleParticipantChange = (
  dispatch: AppDispatch,
  setLastNotification: (notification: Notification) => void,
) => ({ documentData, operation, documentId }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const participant: Participant = documentData;
  let notification;

  switch (operation) {
    case 'INSERT':
      dispatch(insert(participant));
      searcherWorker.buildTree(null, null, null, [participant]);
      notification = { message: 'Participant created' };
      break;
    
    case 'DELETE':
      dispatch(remove(documentId));
      searcherWorker.invalidate(documentId);
      notification = { message: 'Participant removed' };
      break;

    case 'UPDATE':
      dispatch(update({ id: participant.id, changes: participant }));
      searcherWorker.invalidate(participant.id).then(() => {
        searcherWorker.buildTree(null, null, null, [participant]);
      });
      notification = { message: 'Participant updated' };
      break;
  
    default:
      break;
  }

  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};
