import { RxJsonSchema } from 'rxdb';

export interface Picture {
  id?: string,
  localUrl?: string,
  imgurUrl?: string,
  thoughtId: string,
  description?: string,
  created?: number,
  updated?: number,
}

export default ['picture', {
  "title": "Picture schema",
  "version": 0,
  "description": "A Picture",
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
    "localUrl": {
      "type": "string",
    },
    "imgurUrl": {
      "type": "string",
    },
    "description": {
      "type": "string",
    },
    "created": {
      "type": "number",
    },
    "updated": {
      "type": "number",
    },
  },
  "required": ["thoughtId"],
  "attachments": {

  }
} as RxJsonSchema];
