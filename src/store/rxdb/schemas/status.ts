import { RxJsonSchema } from 'rxdb';

export interface Status {
  id?: string,
  thoughtId: string,
  text: string,
  created?: number,
  updated?: number,
}

export default ['status', {
  "title": "Status schema",
  "version": 0,
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
} as RxJsonSchema];
