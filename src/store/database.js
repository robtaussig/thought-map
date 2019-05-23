const DATABASE_VERSION = 5;
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
    {
      table: 'plans',
      object: {
        id: 1,
        name: 'Test Plan',
        created: currentDate,
        updated: currentDate,
        deleted: null,
      },
    },
    {
      table: 'thoughts',
      object: {
        id: 1,
        title: 'Test Thought 1',
        planId: 1,
        type: 'task',
        date: null,
        status: 'new',
        description: 'Test description',
        created: currentDate,
        updated: currentDate,
        deleted: null,
      },
    },
    {
      table: 'thoughts',
      object: {
        id: 2,
        title: 'Test Thought 2',
        planId: 1,
        type: 'memo',
        status: 'complete',
        description: 'Test description 2',
        created: currentDate,
        updated: currentDate,
        deleted: null,
      },
    },
    {
      table: 'thoughts',
      object: {
        id: 3,
        title: 'Test Thought 3',
        planId: 1,
        type: 'reminder',
        status: 'pending',
        description: 'Test description 3',
        created: currentDate,
        updated: currentDate,
        deleted: null,
      },
    },
    {
      table: 'connections',
      object: {
        id: 1,
        from: 1,
        to: 3,
        created: currentDate,
        updated: currentDate,
        deleted: null,
      },
    },
    {
      table: 'connections',
      object: {
        id: 2,
        from: 3,
        to: 1,
        created: currentDate,
        updated: currentDate,
        deleted: null,
      },
    },
    {
      table: 'connections',
      object: {
        id: 3,
        from: 1,
        to: 2,
        created: currentDate,
        updated: currentDate,
        deleted: null,
      },
    },
    {
      table: 'tags',
      object: {
        id: 1,
        thoughtId: 1,
        index: 0,
        text: 'important',
        created: currentDate,
        updated: currentDate,
        deleted: null,
      },
    },
    {
      table: 'tags',
      object: {
        id: 2,
        thoughtId: 1,
        index: 1,
        text: 'fun',
        created: currentDate,
        updated: currentDate,
        deleted: null,
      },
    },
    {
      table: 'tags',
      object: {
        id: 3,
        thoughtId: 2,
        index: 0,
        text: 'important',
        created: currentDate,
        updated: currentDate,
        deleted: null,
      },
    },
    {
      table: 'notes',
      object: {
        id: 1,
        thoughtId: 1,
        index: 1,
        text: 'This is the first note ever!',
        created: currentDate,
        updated: currentDate,
        deleted: null,
      },
    },
    {
      table: 'notes',
      object: {
        id: 2,
        thoughtId: 1,
        index: 1,
        text: 'This is the second note ever!',
        created: currentDate,
        updated: currentDate,
        deleted: null,
      },
    },
  ],
};

LocalStore.createMigrations(DATABASE_SCHEMA, DATABASE_VERSION);

export const db = LocalStore;