import { RxJsonSchema } from 'rxdb';

export interface Participant {
  id?: string;
  thoughtId: string;
  name: string;
  email: string;
  created?: number;
  updated?: number;
}

export default ['participant', {
  'title': 'Participant schema',
  'version': 0,
  'description': 'A Participant',
  'type': 'object',
  'primaryKey': 'id',
  'properties': {
    'id': {
      'type': 'string',
    },
    'thoughtId': {
      'ref': 'thought',
      'type': 'string',
    },
    'name': {
      'type': 'string',
    },
    'email': {
      'type': 'string',
    },
    'created': {
      'type': 'number',
    },
    'updated': {
      'type': 'number',
    },
  },
  'required': ['name', 'email', 'thoughtId'],
  'attachments': {

  }
} as RxJsonSchema<Participant>];
