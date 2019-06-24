import schemas from './schemas';

export const DB_SETTINGS = {
  name: 'thoughtmap',           // <- name
  adapter: 'idb',          // <- storage-adapter
  multiInstance: true,         // <- multiInstance (optional, default: true)
  queryChangeDetection: true // <- queryChangeDetection (optional, default: false)
};

const initializeCollection = (db, tableName, schema, rest) => {
  return db.collection({
    name: tableName,
    schema,
    pouchSettings: {}, // (optional)
    statics: {}, // (optional) // ORM-functions for this collection
    methods: {}, // (optional) ORM-functions for documents
    attachments: {}, // (optional) ORM-functions for attachments
    options: {}, // (optional) Custom paramters that might be used in plugins
    migrationStrategies: {}, // (optional)
    autoMigrate: true, // (optional)
    ...rest,
  });
};

export const initializeCollections = async db => {
  return Promise.all(schemas.map(([tableName, schema, rest = {}]) => initializeCollection(db, tableName, schema, rest)))
};
