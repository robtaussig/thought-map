import Thoughts from '../models/thoughts';
import Connections from '../models/connections';
import Plans from '../models/plans';

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
