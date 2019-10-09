import { Dispatch } from 'react';
import { ACTION_TYPES } from '../reducers';
import { intoMap, convertSettings, thoughtStatuses } from '../lib/util';
import {
  Status as StatusType,
} from './rxdb/schemas/types';
import { RxDatabase } from 'rxdb';
import {
  thoughts as thoughtActions,
  plans as planActions,
  connections as connectionActions,
  notes as noteActions,
  tags as tagActions,
  templates as templateActions,
  pictures as pictureActions,
  settings as settingActions,
  statuses as statusActions,
} from '../actions';
import { Action } from '../hooks/useXReducer';

export const initializeApplication = async (db: RxDatabase, dispatch: Dispatch<Action>) => {
  const [ thoughts, connections, plans, notes, tags, templates, pictures, settings, statuses ] = await Promise.all([
    thoughtActions.getThoughts(db),
    connectionActions.getConnections(db),
    planActions.getPlans(db),
    noteActions.getNotes(db),
    tagActions.getTags(db),
    templateActions.getTemplates(db),
    pictureActions.getPictures(db),
    settingActions.getSettings(db),
    statusActions.getStatuses(db),
  ]);

  const statusesById = intoMap(statuses);
  const statusesByThought = thoughtStatuses(statuses);

  const thoughtWithLatestStatus = thoughts.map(thought => {
    if (statusesByThought[thought.id]) {
      const statusId = statusesByThought[thought.id][0];
      const statusText = (statusesById[statusId] as StatusType).text;

      return {
        ...thought,
        status: statusText,
      };
    }

    return thought;
  });
  
  dispatch({
    type: ACTION_TYPES.INITIALIZE_APPLICATION,
    payload: {
      thoughts: thoughtWithLatestStatus,
      connections: intoMap(connections),
      plans,
      notes: intoMap(notes),
      tags: intoMap(tags),
      pictures: intoMap(pictures),
      statuses: statusesById,
      statusesByThought: statusesByThought,
      templates,
      settings: convertSettings(settings),
    },
  });

  return true;
};

export default initializeApplication;
