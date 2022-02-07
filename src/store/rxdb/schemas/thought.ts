import { RxDocument, RxJsonSchema } from 'rxdb';

export interface Thought {
  id?: string;
  title: string;
  planId?: string;
  date?: string;
  time?: string;
  type?: string;
  status?: string;
  sections: string;
  priority?: number;
  archived?: boolean;
  recurring?: number;
  stagedOn?: string;
  stageIndex?: number;
  description?: string;
  goalPoints?: number;
  hideFromHomeScreen?: boolean;
  lastIcsCalendarSequence?: number;
  index?: number;
  created?: number;
  updated?: number;
  _rev?: string;
}

export default ['thought', {
  'title': 'Thought schema',
  'version': 11,
  'description': 'A Thought',
  'type': 'object',
  'primaryKey': 'id',
  'properties': {
    'id': {
      'type': 'string',
    },
    'planId': {
      'type': 'string',
      'ref': 'plan',
    },
    'title': {
      'type': 'string',
    },
    'date': {
      'type': 'string',
    },
    'time': {
      'type': 'string',
    },
    'sections': {
      'type': 'string',
    },
    'type': {
      'type': 'string',
    },
    'goalPoints': {
      'type': 'number',
    },
    'archived': {
      'type': 'boolean',
    },
    'status': {
      'type': 'string',
    },
    'priority': {
      'type': 'number',
    },
    'description': {
      'type': 'string',
    },
    'recurring': {
      'type': 'number',
    },
    'hideFromHomeScreen': {
      'type': 'boolean',
    },
    'stagedOn': {
      'type': 'string',
    },
    'index': {
      'type': 'number',
    },
    'lastIcsCalendarSequence': {
      'type': 'number',
      'default': -1,
    },
    'stageIndex': {
      'type': 'number',
      'default': 0,
    },
    'created': {
      'type': 'number',
    },
    'updated': {
      'type': 'number',
    },
  },
  'required': ['title'],
  'attachments': {

  }
} as RxJsonSchema<Thought>, {
  'migrationStrategies': {
    1: (oldThought: RxDocument<Thought>) => {
      oldThought.priority = 5;
      return oldThought;
    },
    2: (oldThought: RxDocument<Thought>) => {
      oldThought.recurring = 0;
      return oldThought;
    },
    3: (oldThought: RxDocument<Thought>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      oldThought.calendarLink = '';
      return oldThought;
    },
    4: (oldThought: RxDocument<Thought>) => {
      oldThought.sections = '';
      return oldThought;
    },
    5: (oldThought: RxDocument<Thought>) => {
      oldThought.goalPoints = 0;
      return oldThought;
    },
    6: (oldThought: RxDocument<Thought>) => {
      oldThought.hideFromHomeScreen = false;
      return oldThought;
    },
    7: (oldThought: RxDocument<Thought>) => {
      oldThought.stagedOn = '';
      return oldThought;
    },
    8: (oldThought: RxDocument<Thought>) => {
      oldThought.archived = false;
      return oldThought;
    },
    9: (oldThought: RxDocument<Thought>) => {
      oldThought.stageIndex = 0;
      return oldThought;
    },
    10: (oldThought: RxDocument<Thought>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      delete oldThought.calendarLink;
      return oldThought;
    },
    11: (oldThought: RxDocument<Thought>) => {
      oldThought.lastIcsCalendarSequence = -1;
      return oldThought;
    },
  },
}];
