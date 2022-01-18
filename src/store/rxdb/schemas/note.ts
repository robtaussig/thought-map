import { RxJsonSchema } from 'rxdb';

export interface Note {
  id?: string;
  thoughtId: string;
  text: string;
  index?: number;
  created?: number;
  updated?: number;
}

export default ['note', {
    'title': 'Note schema',
    'version': 0,
    'description': 'A Note',
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
} as RxJsonSchema<Note>];
