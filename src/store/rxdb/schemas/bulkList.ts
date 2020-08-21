import { RxJsonSchema, RxDocument } from 'rxdb';

export interface BulkList {
  id?: string;
  name: string;
  list: string;
  created?: number;
  updated?: number;
}

export default ['bulk_list', {
  "title": "BulkList schema",
  "version": 1,
  "description": "A BulkList",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "primary": true,
    },
    "name": {
      "type": "string",
    },
    "list": {
      "type": "string",
    },
    "created": {
      "type": "number",
    },
    "updated": {
      "type": "number",
    },
  },
  "required": ["list", "name"],
  "attachments": {

  },
} as RxJsonSchema, {
    "migrationStrategies": {
      1: (oldBulkList: RxDocument<BulkList>) => {
          oldBulkList.name = 'Unknown';
          return oldBulkList;
      },
    },
}];
