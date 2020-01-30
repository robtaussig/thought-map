import { RxJsonSchema, RxDocument } from 'rxdb';

export interface Backup {
  id?: string;
  backupId: string;
  privateKey: string;
  isActive?: boolean;
  version?: number;
  password: string;
  created?: number;
  updated?: number;
}

export default ['backup', {
  "title": "Backup schema",
  "version": 2,
  "description": "A Backup",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "primary": true,
    },
    "backupId": {
      "type": "string",
    },
    "password": {
      "type": "string",
    },
    "isActive": {
      "type": "boolean",
    },
    "privateKey": {
      "type": "string",
    },
    "version": {
      "type": "number",
    },
    "created": {
      "type": "number",
    },
    "updated": {
      "type": "number",
    },
  },
  "required": ["backupId", "password", "privateKey"],
  "attachments": {

  }
} as RxJsonSchema, {
  "migrationStrategies": {
    1: (oldBackup: RxDocument<Backup>) => {
      oldBackup.isActive = false;
      return oldBackup;
    },
    2: (oldBackup: RxDocument<Backup>) => {
      oldBackup.version = 1;
      return oldBackup;
    },
  },
}];
