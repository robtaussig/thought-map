import { Settings as SettingsType, setSettings } from '../reducers/settings';
import { Thoughts as ThoughtsType, setThoughts } from '../reducers/thoughts';
import { Connections as ConnectionsType, setConnections } from '../reducers/connections';
import { Notes as NotesType, setNotes } from '../reducers/notes';
import { Tags as TagsType, setTags } from '../reducers/tags';
import { Backups as BackupsType, setBackups } from '../reducers/backups';
import { Plans as PlansType, setPlans } from '../reducers/plans';
import { Templates as TemplatesType, setTemplates } from '../reducers/templates';
import { Pictures as PicturesType, setPictures } from '../reducers/pictures';
import { setCustomObjects } from '../reducers/customObjects';
import { CustomObject } from './rxdb/schemas/customObject';
import { BulkList } from './rxdb/schemas/bulkList';
import { setBulkLists } from '../reducers/bulkLists';
import { Statuses as StatusesType, setStatuses } from '../reducers/statuses';
import { StatusesByThought as StatusesByThoughtType, setStatusesByThought } from '../reducers/statusesByThought';
import { intoMap } from '../lib/util';
import { RxDatabase } from 'rxdb';
import {
  backups as backupActions,
  bulkLists as bulkListActions,
  connections as connectionActions,
  customObjects as customObjectActions,
  notes as noteActions,
  pictures as pictureActions,
  plans as planActions,
  settings as settingActions,
  statuses as statusActions,
  tags as tagActions,
  templates as templateActions,
  thoughts as thoughtActions,
} from '../actions';
import { Searchable } from '../components/Home/ThoughtSearch';
import { wrap } from 'comlink';
import { AppDispatch } from '~store';

export const searcherWorker = wrap<Searchable>(
  new Worker('../workers/search.worker.ts')
);

export const initializeApplication = async (db: RxDatabase, dispatch: AppDispatch): Promise<BackupsType> => {
  const setSettingsAction = (settings: SettingsType) => dispatch(setSettings(settings));
  const setThoughtsAction = (thoughts: ThoughtsType) => dispatch(setThoughts(thoughts));
  const setConnectionsAction = (connections: ConnectionsType) => dispatch(setConnections(connections));
  const setNotesAction = (notes: NotesType) => dispatch(setNotes(notes));
  const setTagsAction = (tags: TagsType) => dispatch(setTags(tags));
  const setPlansAction = (plans: PlansType) => dispatch(setPlans(plans));
  const setTemplatesAction = (templates: TemplatesType) => dispatch(setTemplates(templates));
  const setPicturesAction = (pictures: PicturesType) => dispatch(setPictures(pictures));
  const setBackupsAction = (backups: BackupsType) => dispatch(setBackups(backups));
  const setStatusesAction = (statuses: StatusesType) => dispatch(setStatuses(statuses));
  const setStatusesByThoughtAction = (statusesByThought: StatusesByThoughtType) => dispatch(setStatusesByThought(statusesByThought));
  const setCustomObjectsAction = (customObjects: CustomObject[]) => dispatch(setCustomObjects(customObjects));
  const setBulkListsAction = (bulkLists: BulkList[]) => dispatch(setBulkLists(bulkLists));

  //Need to split by groups of 10, due to bug with TypeScript: https://github.com/Microsoft/TypeScript/issues/22469
  const [allThoughts, allConnections, allPlans, allNotes, allTags, templates, allPictures, settings, allStatuses, bulkLists] = await Promise.all([
    thoughtActions.getThoughts(db),
    connectionActions.getConnections(db),
    planActions.getPlans(db),
    noteActions.getNotes(db),
    tagActions.getTags(db),
    templateActions.getTemplates(db),
    pictureActions.getPictures(db),
    settingActions.getSettings(db),
    statusActions.getStatuses(db),
    bulkListActions.getBulkLists(db),
  ]);

  const settingsMap = settings.reduce((next, { field, value }) => {
    next[field] = value;
    return next;
  }, { didInit: true } as SettingsType);

  const plans = allPlans.filter(({ archived }) => settingsMap.displayArchived || !archived);
  const unarchivedPlanIds = new Set(plans.map(({ id }) => id));

  const thoughts = allThoughts.filter(({ archived, planId }) => (settingsMap.displayArchived || !archived) && (!planId || unarchivedPlanIds.has(planId)));
  const unarchivedThoughtIds = new Set(thoughts.map(({ id }) => id));

  const [
    connections,
    notes,
    tags,
    pictures,
    statuses,
  ] = [
    allConnections.filter(({ from, to }) => unarchivedThoughtIds.has(from) && unarchivedThoughtIds.has(to)),
    allNotes.filter(({ thoughtId }) => unarchivedThoughtIds.has(thoughtId)),
    allTags.filter(({ thoughtId }) => unarchivedThoughtIds.has(thoughtId)),
    allPictures.filter(({ thoughtId }) => unarchivedThoughtIds.has(thoughtId)),
    allStatuses.filter(({ thoughtId }) => unarchivedThoughtIds.has(thoughtId)),
  ];

  const [backups, customObjects] = await Promise.all([
    backupActions.getBackups(db),
    customObjectActions.getCustomObjects(db),
  ]);

  const statusesById = intoMap(statuses);
  const notesById = intoMap(notes);
  const tagsById = intoMap(tags);
  const picturesById = intoMap(pictures);
  const connectionsById = intoMap(connections);
  const statusesByThought = statuses.reduce((next, { id, thoughtId }) => {
    next[thoughtId] = next[thoughtId] || [];
    next[thoughtId].push(id);
    return next;
  }, {} as StatusesByThoughtType);

  setThoughtsAction(thoughts);
  setConnectionsAction(connectionsById);
  setPlansAction(allPlans);
  setNotesAction(notesById);
  setTagsAction(tagsById);
  setTemplatesAction(templates);
  setPicturesAction(picturesById);
  setSettingsAction(settingsMap);
  setStatusesAction(statusesById);
  setStatusesByThoughtAction(statusesByThought);
  setBackupsAction(backups);
  setCustomObjectsAction(customObjects);
  setBulkListsAction(bulkLists);

  searcherWorker.buildTree(thoughts, notesById, tagsById);

  return backups;
};

export default initializeApplication;
