export default ['thought', {
  "title": "Thought schema",
  "version": 1,
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
    "type": {
      "type": "string",
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
}, {
  "migrationStrategies": {
    1: oldThought => {
      oldThought.priority = 5;
      return oldThought;
    },
  },
}];
