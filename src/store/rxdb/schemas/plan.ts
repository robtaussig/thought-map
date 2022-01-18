import { RxDocument, RxJsonSchema } from 'rxdb';

export interface Plan {
  id?: string;
  name: string;
  showCompleted?: boolean;
  groupThoughts?: boolean;
  archived?: boolean;
  defaultType?: string;
  defaultSections?: string;
  created?: number;
  updated?: number;
}

export default ['plan', {
  'title': 'Plan schema',
  'version': 5,
  'description': 'A Plan',
  'type': 'object',
  'primaryKey': 'id',
  'properties': {
    'id': {
      'type': 'string',
    },
    'name': {
      'type': 'string',
    },
    'showCompleted': {
      'type': 'boolean',
    },
    'groupThoughts': {
      'type': 'boolean',
    },
    'defaultType': {
      'type': 'string',
    },
    'defaultSections': {
      'type': 'string',
    },
    'archived': {
      'type': 'boolean',
    },
    'created': {
      'type': 'number',
    },
    'updated': {
      'type': 'number',
    },
  },
  'required': ['name'],
  'attachments': {

  },
} as RxJsonSchema<Plan>, {
  'migrationStrategies': {
    1: (oldPlan: RxDocument<Plan>) => {
      oldPlan.showCompleted = false;
      return oldPlan;
    },
    2: (oldPlan: RxDocument<Plan>) => {
      oldPlan.defaultType = 'task';
      return oldPlan;
    },
    3: (oldPlan: RxDocument<Plan>) => {
      oldPlan.archived = false;
      return oldPlan;
    },
    4: (oldPlan: RxDocument<Plan>) => {
      oldPlan.defaultSections = '';
      return oldPlan;
    },
    5: (oldPlan: RxDocument<Plan>) => {
      oldPlan.groupThoughts = true;
      return oldPlan;
    },
  },
}];
