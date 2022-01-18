import { RxDatabase } from 'rxdb';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { Plan } from '../../../../store/rxdb/schemas/plan';
import { Note } from '../../../../store/rxdb/schemas/note';
import { Tag } from '../../../../store/rxdb/schemas/tag';
import { Picture } from '../../../../store/rxdb/schemas/picture';
import { Setting } from '../../../../store/rxdb/schemas/setting';
import { Connection } from '../../../../store/rxdb/schemas/connection';
import { Status } from '../../../../store/rxdb/schemas/status';
import {
  connections as connectionActions,
  notes as noteActions,
  pictures as pictureActions,
  plans as planActions,
  settings as settingActions,
  statuses as statusActions,
  tags as tagActions,
  thoughts as thoughtActions,
} from '../../../../actions';
import {
  FormattedResult,
  FormattedResultActionEnum,
  OrphanedChildObject,
  OrphanedChildSource,
  SolutionTypes,
} from '../../types';

const formatResults = (
  orphanedObjects: OrphanedChildObject[],
  statuslessThoughts: Thought[],
  uncategorizedThoughts: Thought[],
  orphanedThoughts: Thought[],
  brokenConnections: Connection[],
  fatPictures: Picture[],
): FormattedResult[] => {
  const formattedResults: FormattedResult[] = [];

  orphanedObjects.forEach(({ table, item }) => {
    formattedResults.push({
      action: FormattedResultActionEnum.CAN_FIX,
      furtherDetails: 'Several child objects were found without an associated parent. They should be deleted.',
      table,
      affectedItems: [item],
      title: 'Orphaned Item',
      solution: SolutionTypes.DELETE,
    });
  });

  statuslessThoughts.forEach(statuslessThought => {
    formattedResults.push({
      action: FormattedResultActionEnum.CAN_FIX,
      furtherDetails: 'These thoughts do not have an associated status. This might be due to unmigrated data from an older version of the app. At least a new status should be created for each thought.',
      table: 'thought',
      affectedItems: [statuslessThought],
      title: 'Statusless Thought',
      solution: SolutionTypes.CREATE_STATUS
    });
  });

  uncategorizedThoughts.forEach(uncategorizedThought => {
    formattedResults.push({
      action: FormattedResultActionEnum.NOT_BUG,
      furtherDetails: 'Though not an issue, these thoughts are not categorized under a plan.',
      table: 'thought',
      affectedItems: [uncategorizedThought],
      title: 'Uncategorized Thought',
    });
  });

  orphanedThoughts.forEach(orphanedThought => {
    formattedResults.push({
      action: FormattedResultActionEnum.CAN_FIX,
      furtherDetails: 'These thoughts were categorized under a plan that no longer exists. They should be uncategorized.',
      table: 'thought',
      affectedItems: [orphanedThought],
      title: 'Orphaned Thought',
      solution: SolutionTypes.NULL_OUT_PLAN_ID,
    });
  });

  brokenConnections.forEach(brokenConnection => {
    formattedResults.push({
      action: FormattedResultActionEnum.CAN_FIX,
      furtherDetails: 'These connections are no longer attached to two thoughts and should be deleted.',
      table: 'connection',
      affectedItems: [brokenConnection],
      title: 'Broken Connection',
      solution: SolutionTypes.DELETE,
    });
  });

  fatPictures.forEach(fatPicture => {
    formattedResults.push({
      action: FormattedResultActionEnum.CAN_FIX,
      furtherDetails: 'These pictures should be backed up to imgur and contain a valid url, but still have a stored copy in local memory. The local version has been deleted to preserve resources.',
      table: 'picture',
      affectedItems: [fatPicture],
      title: 'Fat Picture',
    });
  });

  return formattedResults;
};

const getOrphanedObjects = (orphanedChildObjectSources: OrphanedChildSource[], thoughtIds: Set<string>): OrphanedChildObject[] => {
  return orphanedChildObjectSources.reduce((results, { table, items }) => {
    items.forEach(item => {
      if (thoughtIds.has(item.thoughtId) === false) {
        results.push({ table, item });
      }
    });
    return results;
  }, [] as OrphanedChildObject[]);
};

const getStatuslessThoughts = (thoughts: Thought[], statuses: Status[]): Thought[] => {
  return thoughts.filter(thought => {
    return statuses.some(status => status.thoughtId === thought.id) === false;
  });
};

const isBrokenConnection = (thoughtIds: Set<string>): (connection: Connection) => boolean => {
  return connection => {
    return !(connection.to &&
      connection.from &&
      thoughtIds.has(connection.from) === true &&
      thoughtIds.has(connection.to) === true);
  };
};

const getDBItems = (db: RxDatabase): Promise<[
  Thought[], Connection[], Plan[], Note[], Tag[], Picture[], Setting[], Status[]
]> => {
  return Promise.all([
    thoughtActions.getThoughts(db),
    connectionActions.getConnections(db),
    planActions.getPlans(db),
    noteActions.getNotes(db),
    tagActions.getTags(db),
    pictureActions.getPictures(db),
    settingActions.getSettings(db),
    statusActions.getStatuses(db),
  ]);
};

export const runDiagnosis = async (db: RxDatabase) => {
  const [thoughts, connections, plans, notes, tags, pictures, _settings, statuses] = await getDBItems(db);
  const thoughtIds = new Set<string>(thoughts.map<string>(({ id }) => id));
  const orphanedChildObjectSources: OrphanedChildSource[] = [
    { table: 'note', items: notes },
    { table: 'tag', items: tags },
    { table: 'tag', items: tags },
    { table: 'picture', items: pictures },
    { table: 'status', items: statuses },
  ];

  const orphanedObjects = getOrphanedObjects(orphanedChildObjectSources, thoughtIds);
  const statuslessThoughts = getStatuslessThoughts(thoughts, statuses);
  const uncategorizedThoughts: Thought[] = thoughts.filter(thought => !thought.planId);
  const orphanedThoughts: Thought[] = thoughts.filter(thought => {
    return thought.planId && (plans.some(plan => plan.id === thought.planId) === false);
  });
  const brokenConnections: Connection[] = connections.filter(isBrokenConnection(thoughtIds));
  //Has both localUrl and imgurUrl
  const fatPictures: Picture[] = pictures.filter(({ imgurUrl, localUrl }) => {
    return imgurUrl && localUrl;
  });

  return formatResults(
    orphanedObjects,
    statuslessThoughts,
    uncategorizedThoughts,
    orphanedThoughts,
    brokenConnections,
    fatPictures,
  );
};