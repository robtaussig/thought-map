import { RxJsonSchema } from 'rxdb';

export interface Backup {
  id?: string;
  backupId: string;
  privateKey: string;
  isActive?: boolean;
  merged?: boolean;
  version?: number;
  password: string;
  created?: number;
  updated?: number;
}

export default ['doc_backup', {
  'title': 'Backup schema',
  'version': 0,
  'description': 'A Backup',
  'type': 'object',
  'primaryKey': 'id',
  'properties': {
    'id': {
      'type': 'string',
    },
    'backupId': {
      'type': 'string',
    },
    'merged': {
      'type': 'boolean',
    },
    'password': {
      'type': 'string',
    },
    'isActive': {
      'type': 'boolean',
    },
    'privateKey': {
      'type': 'string',
    },
    'version': {
      'type': 'number',
    },
    'created': {
      'type': 'number',
    },
    'updated': {
      'type': 'number',
    },
  },
  'required': ['backupId', 'password', 'privateKey'],
  'attachments': {

  }
} as RxJsonSchema<Backup>];
