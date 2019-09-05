import Thoughts from '../models/thoughts';
import Connections from '../models/connections';
import Plans from '../models/plans';
import Notes from '../models/notes';
import Tags from '../models/tags';
import Templates from '../models/templates';
import Pictures from '../models/pictures';
import Settings from '../models/settings';

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
};

export const settings = {
  getSettings: Settings.fetchAll,
  getSetting: Settings.fetch,
  createSetting: Settings.upsert,
  deleteSetting: Settings.delete,
  editSetting: Settings.upsert,
};
