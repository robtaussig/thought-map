import { RxJsonSchema } from 'rxdb';

export interface Backup {
  id?: string;
  backupId: string;
  privateKey: string;
  password: string;
  created?: number;
  updated?: number;
}

export default ['backup', {
  "title": "Backup schema",
  "version": 0,
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
    "privateKey": {
      "type": "string",
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
} as RxJsonSchema];
