import { RxJsonSchema } from 'rxdb';

export interface Deletion {
  id?: string;
  collectionName: string;
  itemId: string;
  created?: number;
  updated?: number;
}

export default ['deletion', {
    'title': 'Deletion schema',
    'version': 0,
    'description': 'A Deletion',
    'type': 'object',
    'primaryKey': 'id',
    'properties': {
        'id': {
            'type': 'string',
        },
        'collectionName': {
            'type': 'string',
        },
        'itemId': {
            'type': 'string',
        },
        'created': {
            'type': 'number',
        },
        'updated': {
            'type': 'number',
        },
    },
    'indexes': ['itemId'],
    'required': ['collectionName', 'itemId'],
    'attachments': {

    }
} as RxJsonSchema<Deletion>];
