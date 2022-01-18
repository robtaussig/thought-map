import { RxJsonSchema } from 'rxdb';

export interface Tag {
  id?: string;
  thoughtId: string;
  text: string;
  index?: number;
  created?: number;
  updated?: number;
}

export default ['tag', {
  'title': 'Tag schema',
  'version': 0,
  'description': 'A Tag',
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
    'text': {
      'type': 'string',
    },
    'index': {
      'type': 'number',
    },
    'created': {
      'type': 'number',
    },
    'updated': {
      'type': 'number',
    },
  },
  'required': ['text', 'thoughtId'],
  'attachments': {

  }
} as RxJsonSchema<Tag>];
