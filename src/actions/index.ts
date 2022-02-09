import Thoughts from '../models/thoughts';
import Connections from '../models/connections';
import Plans from '../models/plans';
import Notes from '../models/notes';
import Participants from '../models/participants';
import Tags from '../models/tags';
import Templates from '../models/templates';
import Pictures from '../models/pictures';
import Settings from '../models/settings';
import Statuses from '../models/statuses';
import Backups from '../models/backups';
import CustomObjects from '../models/customObjects';
import BulkLists from '../models/bulkLists';
import Deletions from '../models/deletions';

export const thoughts = {
  getThoughts: Thoughts.fetchAll,
  getThought: Thoughts.fetch,
  createThought: Thoughts.add,
  deleteThought: Thoughts.delete,
  editThought: Thoughts.update,
};

export const connections = {
  getConnections: Connections.fetchAll,
  getConnection: Connections.fetch,
  createConnection: Connections.add,
  deleteConnection: Connections.delete,
  editConnection: Connections.update,
};

export const plans = {
  getPlans: Plans.fetchAll,
  getPlan: Plans.fetch,
  createPlan: Plans.add,
  deletePlan: Plans.delete,
  editPlan: Plans.update,
};

export const notes = {
  getNotes: Notes.fetchAll,
  getNote: Notes.fetch,
  createNote: Notes.add,
  deleteNote: Notes.delete,
  editNote: Notes.update,
};

export const tags = {
  getTags: Tags.fetchAll,
  getTag: Tags.fetch,
  createTag: Tags.add,
  deleteTag: Tags.delete,
  editTag: Tags.update,
};

export const templates = {
  getTemplates: Templates.fetchAll,
  getTemplate: Templates.fetch,
  createTemplate: Templates.add,
  deleteTemplate: Templates.delete,
  editTemplate: Templates.update,
};

export const pictures = {
  getPictures: Pictures.fetchAll,
  getPicture: Pictures.fetch,
  createPicture: Pictures.add,
  deletePicture: Pictures.delete,
  editPicture: Pictures.update,
  createAttachment: Pictures.addAttachment,
  getAttachment: Pictures.fetchAttachment,
};

export const settings = {
  getSettings: Settings.fetchAll,
  getSetting: Settings.fetch,
  findSetting: Settings.find,
  createSetting: Settings.upsert,
  deleteSetting: Settings.delete,
  editSetting: Settings.upsert,
};

export const statuses = {
  getStatuses: Statuses.fetchAll,
  getStatus: Statuses.fetch,
  createStatus: Statuses.add,
  deleteStatus: Statuses.delete,
  editStatus: Statuses.update,
};

export const backups = {
  getBackups: Backups.fetchAll,
  getBackup: Backups.fetch,
  createBackup: Backups.upsert,
  deleteBackup: Backups.delete,
  editBackup: Backups.update,
};

export const customObjects = {
  getCustomObjects: CustomObjects.fetchAll,
  getCustomObject: CustomObjects.fetch,
  createCustomObject: CustomObjects.add,
  deleteCustomObject: CustomObjects.delete,
  editCustomObject: CustomObjects.update,
};

export const deletions = {
  getDeletions: Deletions.fetchAll,
  getDeletion: Deletions.fetch,
  createDeletion: Deletions.add,
  deleteDeletion: Deletions.delete,
  editDeletion: Deletions.update,
};

export const bulkLists = {
  getBulkLists: BulkLists.fetchAll,
  getBulkList: BulkLists.fetch,
  createBulkList: BulkLists.add,
  deleteBulkList: BulkLists.delete,
  editBulkList: BulkLists.update,
};

export const participants = {
  getParticipants: Participants.fetchAll,
  getParticipant: Participants.fetch,
  createParticipant: Participants.add,
  deleteParticipant: Participants.delete,
  editParticipant: Participants.update,
};
