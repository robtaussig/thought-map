export const DB_SETTINGS = {
  name: 'heroesdb',           // <- name
  adapter: 'idb',          // <- storage-adapter
  password: 'myPassword',     // <- password (optional)
  multiInstance: true,         // <- multiInstance (optional, default: true)
  queryChangeDetection: false // <- queryChangeDetection (optional, default: false)
};

export const initializeCollections = async db => {

  return db;
};
