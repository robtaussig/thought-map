export default ['template', {
  "title": "Template schema",
  "version": 0,
  "description": "A Template",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "primary": true,
    },
    "name": {
      "type": "string",
    },
    "template": {
      "type": "string",
    },
    "created": {
      "type": "number",
    },
    "updated": {
      "type": "number",
    },
  },
  "required": ["name", "template"],
  "attachments": {

  }
}];
