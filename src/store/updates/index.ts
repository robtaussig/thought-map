import { handleThoughtChange } from './thoughts';
import { handleConnectionChange } from './connections';
import { handleBackupChange } from './backups';
import { handleNoteChange } from './notes';
import { handlePictureChange } from './pictures';
import { handleSettingChange } from './settings';
import { handleTagChange } from './tags';
import { handlePlanChange } from './plans';
import { handleBulkListChange } from './bulkLists';
import { handleTemplateChange } from './templates';
import { handleStatusChange } from './statuses';
import { handleCustomObjectChange } from './customObjects';
import { Notification } from '../../types';
import {
  Picture as PictureType,
  Status as StatusType,
} from '../rxdb/schemas/types';
import { Dispatch } from '@reduxjs/toolkit';
import { RxDatabase } from 'rxdb';
import {
  pictures as pictureActions,
  settings as settingActions,
  statuses as statusActions,
  thoughts as thoughtActions,
} from '../../actions';
import { addHours, format } from 'date-fns'

const matchStatusLocationIfEnabled = (db: RxDatabase) => async (status: StatusType): Promise<void> => {
  const [useLocation] = await settingActions.findSetting(db, 'field', 'useLocation');
  if (useLocation && useLocation.value === true) {
    navigator.geolocation.getCurrentPosition(position => {
      if (position && position.coords) {
        const locationValue = `${position.coords.latitude},${position.coords.longitude}`;
        const nextStatus = {
          ...status,
          location: locationValue,
        };
        statusActions.editStatus(db, nextStatus);
      }
    });
  }
};

const recreateThoughtIfRecurring = (db: RxDatabase) => async (thoughtId: string) => {
  const thought = await thoughtActions.getThought(db, thoughtId);
  if (thought.recurring) {
    const next = addHours(new Date(), thought.recurring);
    const date = format(next, 'yyyy-MM-dd');
    const time = format(next, 'HH:mm');
    const { id, _rev, updated, created, ...nextThought } = thought;
    const newThought = await thoughtActions.createThought(db, {
      ...nextThought,
      status: 'new',
      date,
      time,
    });
    statusActions.createStatus(db, {
      thoughtId: newThought.id,
      text: 'new',
    });
  }
};

const matchPictureLocationIfEnabled = (db: RxDatabase) => async (picture: PictureType): Promise<void> => {
  const [useLocation] = await settingActions.findSetting(db, 'field', 'useLocation');
  if (useLocation && useLocation.value === true) {
    navigator.geolocation.getCurrentPosition(position => {
      if (position && position.coords) {
        const locationValue = `${position.coords.latitude},${position.coords.longitude}`;
        const nextPicture = {
          ...picture,
          location: locationValue,
        };
        pictureActions.editPicture(db, nextPicture);
      }
    });
  }
};

export const subscribeToChanges = (
  db: RxDatabase,
  dispatch: Dispatch<any>,
  setLastNotification: (notification: Notification) => void,
): (() => void) => {
  const subscriptions = [
    //@ts-ignore
    db.thought.$.subscribe(handleThoughtChange(dispatch, setLastNotification)),
    //@ts-ignore
    db.connection.$.subscribe(handleConnectionChange(dispatch, setLastNotification)),
    //@ts-ignore
    db.note.$.subscribe(handleNoteChange(dispatch, setLastNotification)),
    //@ts-ignore
    db.tag.$.subscribe(handleTagChange(dispatch, setLastNotification)),
    //@ts-ignore
    db.plan.$.subscribe(handlePlanChange(dispatch, setLastNotification)),
    //@ts-ignore
    db.template.$.subscribe(handleTemplateChange(dispatch, setLastNotification)),
    //@ts-ignore
    db.picture.$.subscribe(handlePictureChange(dispatch, setLastNotification, matchPictureLocationIfEnabled(db))),
    // @ts-ignore
    db.setting.$.subscribe(handleSettingChange(dispatch, setLastNotification)),
    // @ts-ignore
    db.doc_backup.$.subscribe(handleBackupChange(dispatch, setLastNotification)),
    // @ts-ignore
    db.custom_object.$.subscribe(handleCustomObjectChange(dispatch, setLastNotification)),
    // @ts-ignore
    db.bulk_list.$.subscribe(handleBulkListChange(dispatch, setLastNotification)),
    //@ts-ignore
    db.status.$.subscribe(handleStatusChange(
      dispatch,
      setLastNotification,
      matchStatusLocationIfEnabled(db),
      recreateThoughtIfRecurring(db)),
    ),
  ];

  return () => {
    subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  };
};
