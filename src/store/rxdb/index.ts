import schemas from './schemas';
import { RxCollectionCreator, RxDatabase, getRxStoragePouch } from 'rxdb';
import { addPouchPlugin } from 'rxdb/plugins/pouchdb';
addPouchPlugin(require('pouchdb-adapter-idb'));

export const DB_SETTINGS = {
  name: 'thoughtmap', // <- name
  storage: getRxStoragePouch('idb'),
  multiInstance: true, // <- multiInstance (optional, default: true)
  queryChangeDetection: true, // <- queryChangeDetection (optional, default: false)
  ignoreDuplicate: Boolean((module as any)?.hot),
};

export const initializeCollections = async (db: RxDatabase) => {
  return db.addCollections(
    schemas.reduce(
      (acc, [tableName, schema, rest]) => {
        acc[tableName] = {
          schema,
          statics: {}, // (optional) // ORM-functions for this collection
          methods: {}, // (optional) ORM-functions for documents
          attachments: {}, // (optional) ORM-functions for attachments
          options: {}, // (optional) Custom paramters that might be used in plugins
          migrationStrategies: {}, // (optional)
          autoMigrate: true, // (optional)
          ...rest,
        };
        return acc;
      },
      {} as {
        [key: string]: RxCollectionCreator;
      }
    )
  );
};
