export default ['thought', {
  "title": "Thought schema",
  "version": 0,
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
}];
