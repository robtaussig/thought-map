import { RxJsonSchema, RxDocument } from 'rxdb';

export interface Status {
  id?: string;
  thoughtId: string;
  text: string;
  location?: string;
  created?: number;
  updated?: number;
}

export default ['status', {
  "title": "Status schema",
  "version": 1,
  "description": "A Status",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "primary": true,
    },
    "thoughtId": {
      "ref": "thought",
      "type": "string",
    },
    "text": {
      "type": "string",
    },
    "location": {
      "type": "string",
    },
    "index": {
      "type": "number",
    },
    "created": {
      "type": "number",
    },
    "updated": {
      "type": "number",
    },
  },
  "required": ["text", "thoughtId"],
  "attachments": {

  }
} as RxJsonSchema, {
  "migrationStrategies": {
    1: (oldStatus: RxDocument<Status>) => {
      return oldStatus;
    },
  },
}];
