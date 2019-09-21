import { RxJsonSchema, RxDocument } from 'rxdb';

export interface Plan {
  id?: string;
  name: string;
  showCompleted?: boolean;
  archived?: boolean;
  defaultType?: string;
  created?: number;
  updated?: number;
}

export default ['plan', {
  "title": "Plan schema",
  "version": 3,
  "description": "A Plan",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "primary": true,
    },
    "name": {
      "type": "string",
    },
    "showCompleted": {
      "type": "boolean",
    },
    "defaultType": {
      "type": "string",
    },
    "archived": {
      "type": "boolean",
    },
    "created": {
      "type": "number",
    },
    "updated": {
      "type": "number",
    },
  },
  "required": ["name"],
  "attachments": {

  },
} as RxJsonSchema, {
  "migrationStrategies": {
    1: (oldPlan: RxDocument<Plan>) => {
      oldPlan.showCompleted = false;
      return oldPlan;
    },
    2: (oldPlan: RxDocument<Plan>) => {
      oldPlan.defaultType = 'task';
      return oldPlan;
    },
    3: (oldPlan: RxDocument<Plan>) => {
      oldPlan.archived = false;
      return oldPlan;
    },
  },
}];
