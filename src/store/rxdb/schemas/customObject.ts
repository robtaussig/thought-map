import { RxJsonSchema } from 'rxdb';

export enum CustomObjectType {
  Status = 'status',
  Type = 'type',
  Tag = 'tag',
}

export interface CustomObject {
  id?: string;
  type: CustomObjectType;
  value: string;
  created?: number;
  updated?: number;
}

export default ['custom_object', {
  "title": "CustomObject schema",
  "version": 0,
  "description": "A CustomObject",
  "type": "object",
  "primaryKey": "id",
  "properties": {
    "id": {
      "type": "string",
    },
    "type": {
      "type": "string",
    },
    "value": {
      "type": "string",
    },
    "created": {
      "type": "number",
    },
    "updated": {
      "type": "number",
    },
  },
  "required": ["type", "value"],
  "attachments": {

  }
} as RxJsonSchema<CustomObject>];
