const DATABASE_VERSION = 7;
const LocalStore = require('../lib/local-store')({ global: false }, DATABASE_VERSION);

const currentDate = new Date() - 1;
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
    {
      name: 'tags',
      primaryKey: 'id',
      autoIncrement: true,
      indexes: [
        {
          name: 'Thought',
          key: 'thoughtId',
        },
      ]
    },
    {
      name: 'notes',
      primaryKey: 'id',
      autoIncrement: true,
      indexes: [
        {
          name: 'Thought',
          key: 'thoughtId',
        },
      ]
    },
    {
      name: 'thoughtChange',
      primaryKey: 'id',
      autoIncrement: true,
      indexes: [
        {
          name: 'Thought',
          key: 'thoughtId',
        },
      ]
    },
    {
      name: 'connectionChange',
      primaryKey: 'id',
      autoIncrement: true,
      indexes: [
        {
          name: 'Connection',
          key: 'connectionId',
        },
      ]
    },
    {
      name: 'tagChange',
      primaryKey: 'id',
      autoIncrement: true,
      indexes: [
        {
          name: 'Tag',
          key: 'tagId',
        },
      ]
    },
    {
      name: 'noteChange',
      primaryKey: 'id',
      autoIncrement: true,
      indexes: [
        {
          name: 'Note',
          key: 'noteId',
        },
      ]
    },
  ],
  // Seed data below
  objects: [
    
  ],
};

LocalStore.createMigrations(DATABASE_SCHEMA, DATABASE_VERSION);

export const db = LocalStore;