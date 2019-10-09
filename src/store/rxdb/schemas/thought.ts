import { RxJsonSchema, RxDocument } from 'rxdb';

export interface Thought {
  id?: string;
  title: string;
  planId?: string;
  date?: string;
  time?: string;
  type?: string;
  calendarLink?: string;
  status?: string;
  sections: string;
  priority?: number;
  recurring?: number;
  description?: string;
  goalPoints?: number;
  index?: number;
  created?: number;
  updated?: number;
  _rev?: string;
}

export default ['thought', {
  "title": "Thought schema",
  "version": 5,
  "description": "A Thought",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "primary": true,
    },
    "planId": {
      "type": "string",
      "ref": "plan",
    },
    "title": {
      "type": "string",
    },
    "date": {
      "type": "string",
    },
    "time": {
      "type": "string",
    },
    "sections": {
      "type": "string",
    },
    "type": {
      "type": "string",
    },
    "calendarLink": {
      "type": "string",
    },
    "goalPoints": {
      "type": "number",
    },
    "status": {
      "type": "string",
    },
    "priority": {
      "type": "number",
    },
    "description": {
      "type": "string",
    },
    "recurring": {
      "type": "number",
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
  "required": ["title"],
  "attachments": {

  }
} as RxJsonSchema, {
  "migrationStrategies": {
    1: (oldThought: RxDocument<Thought>) => {
      oldThought.priority = 5;
      return oldThought;
    },
    2: (oldThought: RxDocument<Thought>) => {
      oldThought.recurring = 0;
      return oldThought;
    },
    3: (oldThought: RxDocument<Thought>) => {
      oldThought.calendarLink = '';
      return oldThought;
    },
    4: (oldThought: RxDocument<Thought>) => {
      oldThought.sections = '';
      return oldThought;
    },
    5: (oldThought: RxDocument<Thought>) => {
      oldThought.goalPoints = 0;
      return oldThought;
    },
  },
}];
