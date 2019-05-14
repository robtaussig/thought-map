const LocalStore = require('@robtaussig/local-store-js')({ global: false });

const DATABASE_VERSION = 2;
// You can seed data here as well
const DATABASE_SCHEMA = {
  tables: [
    {
      name: 'thoughts',
      primaryKey: 'id',
      autoIncrement: true,
    },
  ],
  // Seed data below
  objects: [

  ],
};

LocalStore.createMigrations(DATABASE_SCHEMA, DATABASE_VERSION);

export const db = LocalStore;