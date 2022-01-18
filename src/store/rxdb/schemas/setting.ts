import { RxJsonSchema } from 'rxdb';

export interface Setting {
  id?: string,
  field: string,
  value: any,
  created?: number,
  updated?: number,
}

export default ['setting', {
    'title': 'Setting schema',
    'version': 0,
    'description': 'A Setting',
    'type': 'object',
    'primaryKey': 'id',
    'properties': {
        'id': {
            'type': 'string',
        },
        'field': {
            'type': 'string',
        },
        'value': {
            'type': 'string',
        },
        'created': {
            'type': 'number',
        },
        'updated': {
            'type': 'number',
        },
    },
    'required': ['field', 'value'],
    'attachments': {

    }
} as RxJsonSchema<Setting>];
