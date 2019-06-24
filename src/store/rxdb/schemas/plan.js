export default ['plan', {
  "title": "Plan schema",
  "version": 1,
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
}, {
  "migrationStrategies": {
    1: oldPlan => {
      oldPlan.showCompleted = false;
      return oldPlan;
    },
  },
}];
