import { RxJsonSchema } from 'rxdb';

export interface Deletion {
  id?: string;
  collectionName: string;
  itemId: string;
  created?: number;
  updated?: number;
}

export default ['deletion', {
  "title": "Deletion schema",
  "version": 0,
  "description": "A Deletion",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "primary": true,
    },
    "collectionName": {
      "type": "string",
    },
    "itemId": {
      "type": "string",
      "index": true,
    },
    "created": {
      "type": "number",
    },
    "updated": {
      "type": "number",
    },
  },
  "required": ["collectionName", "itemId"],
  "attachments": {

  }
} as RxJsonSchema];
