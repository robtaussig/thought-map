import { sortByIndexThenDate } from '../models/base';
import { Setter } from '../hooks/useXReducer';
import {
  Notification,
  Setters,
  RxChangeEvent,
  ConnectionState,
  ThoughtState,
  PlanState,
  NoteState,
  TagState,
  TemplateState,
  PictureState,
  SettingState,
  StatusState,
  StatusesByThought,
} from '../types';
import {
  Thought as ThoughtType,
  Plan as PlanType,
  Note as NoteType,
  Tag as TagType,
  Connection as ConnectionType,
  Template as TemplateType,
  Picture as PictureType,
  Setting as SettingType,
  Status as StatusType,
} from './rxdb/schemas/types';
import { Dispatch, SetStateAction } from 'react';
import { RxDatabase } from 'rxdb';
import {
  pictures as pictureActions,
  settings as settingActions,
  statuses as statusActions,
  thoughts as thoughtActions,
} from '../actions';
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

const handleThoughtChange = (
  setter: Setter<ThoughtState>,
  setLastNotification: Dispatch<SetStateAction<Notification>>,
) => ({ data }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const thought: ThoughtType = data.v;
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => [thought].concat(prev));
      notification = { message: 'Thought created' };
      break;
    
    case 'REMOVE':
      setter(prev => prev.filter((prevThought: ThoughtType) => prevThought.id !== thought.id));
      notification = { message: 'Thought removed' };
      break;

    case 'UPDATE':
      setter(prev => {
        return prev.map((prevThought: ThoughtType) => {
          if (prevThought.id === thought.id) {
            if (+new Date() - prevThought.created > 1000) {
              notification = { message: 'Thought updated' };
            }
            return thought;
          }
          return prevThought;          
        })
          .sort(sortByIndexThenDate)
      });
      
      break;
  
    default:
      break;
  }
  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};

const handleConnectionChange = (
  setter: Setter<ConnectionState>,
  setLastNotification: Dispatch<SetStateAction<Notification>>
) => ({ data }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const connection: ConnectionType = data.v;
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => ({
        ...prev,
        [connection.id]: connection,
      }));
      notification = { message: 'Connection created' };
      break;
    
    case 'REMOVE':
      setter(prev => {
        const next = Object.keys(prev).reduce((nextState, key) => {
          if (key !== connection.id) {
            nextState[key] = prev[key];
          }
          return nextState;
        }, {} as ConnectionState);

        return next;
      });
      notification = { message: 'Connection removed' };
      break;

    case 'UPDATE':
        setter(prev => ({
          ...prev,
          [connection.id]: connection,
        }));
        notification = { message: 'Connection updated' };
      break;
  
    default:
      break;
  }
  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};

const handleNoteChange = (
  setter: Setter<NoteState>,
  setLastNotification: Dispatch<SetStateAction<Notification>>
) => ({ data }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const note: NoteType = data.v;
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => ({
        ...prev,
        [note.id]: note,
      }));
      notification = { message: 'Note created' };
      break;
    
    case 'REMOVE':
      setter(prev => {
        const next = Object.keys(prev).reduce((nextState, key) => {
          if (key !== note.id) {
            nextState[key] = prev[key];
          }
          return nextState;
        }, {} as NoteState);

        return next;
      });
      notification = { message: 'Note removed' };
      break;

    case 'UPDATE':
        setter(prev => ({
          ...prev,
          [note.id]: note,
        }));
        notification = { message: 'Note updated' };
      break;
  
    default:
      break;
  }
  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};

const handlePictureChange = (
  setter: Setter<PictureState>,
  setLastNotification: Dispatch<SetStateAction<Notification>>,
  matchPictureLocationIfEnabled: (picture: PictureType) => void,
) => ({ data }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const picture: PictureType = data.v;
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => ({
        ...prev,
        [picture.id]: picture,
      }));
      notification = { message: 'Picture created' };
      matchPictureLocationIfEnabled(picture);
      break;
    
    case 'REMOVE':
      setter(prev => {
        const next = Object.keys(prev).reduce((nextState, key) => {
          if (key !== picture.id) {
            nextState[key] = prev[key];
          }
          return nextState;
        }, {} as PictureState);

        return next;
      });
      notification = { message: 'Picture removed' };
      break;

    case 'UPDATE':
        setter(prev => ({
          ...prev,
          [picture.id]: picture,
        }));        
      break;
  
    default:
      break;
  }
  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};

const handleSettingChange = (
  setter: Setter<SettingState>,
  setLastNotification: Dispatch<SetStateAction<Notification>>
) => ({ data }: RxChangeEvent) => {
  const setting: SettingType = {
    ...data.v,
    value: JSON.parse(data.v.value),
  };
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => ({
        ...prev,
        [setting.field]: setting.value,
      }));
      notification = { message: 'Setting updated' };
      break;
    
    case 'REMOVE':
      setter(prev => {
        const next = Object.keys(prev).reduce((nextState, key) => {
          if (key !== setting.field) {
            nextState[key] = prev[key];
          }
          return nextState;
        }, {} as SettingState);

        return next;
      });
      notification = { message: 'Setting removed' };
      break;

    case 'UPDATE':
        setter(prev => ({
          ...prev,
          [setting.field]: setting.value,
        }));
        notification = { message: 'Setting updated' };
      break;
  
    default:
      break;
  }
  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};

const handleTagChange = (
  setter: Setter<TagState>,
  setLastNotification: Dispatch<SetStateAction<Notification>>
) => ({ data }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const tag: TagType = data.v;
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => ({
        ...prev,
        [tag.id]: tag,
      }));
      notification = { message: 'Tag created' };
      break;
    
    case 'REMOVE':
      setter(prev => {
        const next = Object.keys(prev).reduce((nextState, key) => {
          if (key !== tag.id) {
            nextState[key] = prev[key];
          }
          return nextState;
        }, {} as TagState);

        return next;
      });
      notification = { message: 'Tag removed' };
      break;

    case 'UPDATE':
        setter(prev => ({
          ...prev,
          [tag.id]: tag,
        }));
        notification = { message: 'Tag updated' };
      break;
  
    default:
      break;
  }
  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};

const handlePlanChange = (
  setter: Setter<PlanState>,
  setLastNotification: Dispatch<SetStateAction<Notification>>
) => ({ data }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const plan: PlanType = data.v;
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => [plan].concat(prev));
      notification = { message: 'Plan created' };
      break;
    
    case 'REMOVE':
      setter(prev => prev.filter(prevPlan => prevPlan.id !== plan.id));
      notification = { message: 'Plan removed' };
      break;

    case 'UPDATE':
      setter(prev => prev.map(prevPlan => prevPlan.id === plan.id ? plan : prevPlan));
      notification = { message: 'Plan updated' };
      break;
  
    default:
      break;
  }
  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};

const handleTemplateChange = (
  setter: Setter<TemplateState>,
  setLastNotification: Dispatch<SetStateAction<Notification>>
) => ({ data }: RxChangeEvent) => {
  const template: TemplateType = {
    ...data.v,
    template: JSON.parse(data.v.template),
  };
  let notification;
  switch (data.op) {
    case 'INSERT':
      setter(prev => [template].concat(prev));
      notification = { message: 'Template created' };
      break;
    
    case 'REMOVE':
      setter(prev => prev.filter(prevTemplate => prevTemplate.id !== template.id));
      notification = { message: 'Template removed' };
      break;

    case 'UPDATE':
      setter(prev => prev.map(prevTemplate => prevTemplate.id === template.id ? template : prevTemplate));
      break;
  
    default:
      break;
  }
  if ((window as any).blockNotifications) return;
  setLastNotification(notification);  
};

const handleStatusChange = (
  setter: Setter<StatusState>,
  setLastNotification: Dispatch<SetStateAction<Notification>>,
  setThoughts: Setter<ThoughtType[]>,
  setStatusesByThought: Setter<StatusesByThought>,
  matchStatusLocationIfEnabled: (status: StatusType) => Promise<void>,
  handleRecurringThought: (thoughtId: string) => Promise<void>,
) => ({ data }: RxChangeEvent) => {
  if ((window as any).blockDBSubscriptions === true) return;
  const status: StatusType = data.v;
  let notification;

  switch (data.op) {
    case 'INSERT':
      setter(prev => ({
        ...prev,
        [status.id]: status,
      }));
      setStatusesByThought(prev => ({
        ...prev,
        [status.thoughtId]: [status.id].concat(prev[status.thoughtId] || []),
      }));
      matchStatusLocationIfEnabled(status);
      if (status.text === 'completed') handleRecurringThought(status.thoughtId);
      break;
    
    case 'REMOVE':
      setter(prev => {
        const next = Object.keys(prev).reduce((nextState, key) => {
          if (key !== status.id) {
            nextState[key] = prev[key];
          }
          return nextState;
        }, {} as StatusState);

        return next;
      });
      setStatusesByThought(prev => ({
        ...prev,
        [status.thoughtId]: (prev[status.thoughtId] || []).filter(statusId => statusId !== status.id),
      }));
      break;

    case 'UPDATE':
        setter(prev => ({
          ...prev,
          [status.id]: status,
        }));
        setThoughts(prev => prev.map(prevThought => {
          if (prevThought.id === status.thoughtId) {
            return {
              ...prevThought,
              status: status.text,
            };
          }
          return prevThought;
        }));

      break;
  
    default:
      break;
  }
  if ((window as any).blockNotifications) return;
  if (notification) setLastNotification(notification);
};

export const subscribeToChanges = async (
  db: RxDatabase,
  setters: Setters,
  setLastNotification: Dispatch<SetStateAction<Notification>>,
  setStatusesByThought: Setter<StatusesByThought>,
) => {
  //@ts-ignore
  db.thought.$.subscribe(handleThoughtChange(setters.thought, setLastNotification));
  //@ts-ignore
  db.connection.$.subscribe(handleConnectionChange(setters.connection, setLastNotification));
  //@ts-ignore
  db.note.$.subscribe(handleNoteChange(setters.note, setLastNotification));
  //@ts-ignore
  db.tag.$.subscribe(handleTagChange(setters.tag, setLastNotification));
  //@ts-ignore
  db.plan.$.subscribe(handlePlanChange(setters.plan, setLastNotification));
  //@ts-ignore
  db.template.$.subscribe(handleTemplateChange(setters.template, setLastNotification));
  //@ts-ignore
  db.picture.$.subscribe(handlePictureChange(setters.picture, setLastNotification, matchPictureLocationIfEnabled(db)));
  //@ts-ignore
  db.setting.$.subscribe(handleSettingChange(setters.setting, setLastNotification));
  //@ts-ignore
  db.status.$.subscribe(handleStatusChange(
    setters.status,
    setLastNotification,
    setters.thought,
    setStatusesByThought,
    matchStatusLocationIfEnabled(db),
    recreateThoughtIfRecurring(db)),
  );
};
