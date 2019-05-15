const DATABASE_VERSION = 4;
const LocalStore = require('@robtaussig/local-store-js')({ global: false }, DATABASE_VERSION);

// You can seed data here as well
const DATABASE_SCHEMA = {
  tables: [
    {
      name: 'plans',
      primaryKey: 'id',
      autoIncrement: true,
      indexes: [
        {
          name: 'Name',
          key: 'name',
        },
      ],
    },
    {
      name: 'thoughts',
      primaryKey: 'id',
      autoIncrement: true,
      indexes: [
        {
          name: 'Plan',
          key: 'planId',
        }
      ],
    },
    {
      name: 'connections',
      primaryKey: 'id',
      autoIncrement: true,
      indexes: [
        {
          name: 'To',
          key: 'to',
        },{
          name: 'From',
          key: 'from',
        },
      ]
    },
  ],
  // Seed data below
  objects: [
    {
      table: 'plans',
      object: {
        id: 1,
        name: 'Primary',
      },
    },
    {
      table: 'thoughts',
      object: {
        id: 1,
        planId: 1,
        text: 'Hello!',
      },
    },
    {
      table: 'thoughts',
      object: {
        id: 2,
        planId: 1,
        text: 'Hello there!',
      },
    },
    {
      table: 'connections',
      object: {
        id: 1,
        from: 1,
        to: 2,
      },
    }
  ],
};

LocalStore.createMigrations(DATABASE_SCHEMA, DATABASE_VERSION);

export const db = LocalStore;