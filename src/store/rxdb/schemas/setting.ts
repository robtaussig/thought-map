import { RxJsonSchema } from 'rxdb';

export interface Setting {
  id?: string,
  field: string,
  value: string,
  created?: number,
  updated?: number,
}

export default ['setting', {
  "title": "Setting schema",
  "version": 0,
  "description": "A Setting",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "primary": true,
    },
    "field": {
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
  "required": ["field", "value"],
  "attachments": {

  }
} as RxJsonSchema];
