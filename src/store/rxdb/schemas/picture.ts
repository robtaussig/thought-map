import { RxJsonSchema, RxDocument } from 'rxdb';

export interface Picture {
  id?: string;
  localUrl?: string;
  imgurUrl?: string;
  thoughtId: string;
  description?: string;
  pinned?: boolean;
  location?: string;
  created?: number;
  updated?: number;
}

export default ['picture', {
  "title": "Picture schema",
  "version": 2,
  "description": "A Picture",
  "type": "object",
  "primaryKey": "id",
  "properties": {
    "id": {
      "type": "string",
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
    "pinned": {
      "type": "boolean",
    },
    "location": {
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
} as RxJsonSchema<Picture>, {
  "migrationStrategies": {
    1: (oldPicture: RxDocument<Picture>) => {
      return oldPicture;
    },
    2: (oldPicture: RxDocument<Picture>) => {
      oldPicture.pinned = false;
      return oldPicture;
    },
  },
}];
