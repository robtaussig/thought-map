export default ['plan', {
  "title": "Plan schema",
  "version": 0,
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
    "created": {
      "type": "number",
    },
    "updated": {
      "type": "number",
    },
  },
  "required": ["name"],
  "attachments": {

  }
}];
