import { createAction } from '@reduxjs/toolkit';
import { Status } from '../store/rxdb/schemas/status';
import { Connection } from '../store/rxdb/schemas/connection';
import { Thought } from '../store/rxdb/schemas/thought';

export const bulkCreateThoughtsAndConnections = createAction<{
  thoughts: Thought[],
  connections: Connection[],
  statuses: Status[],
}>('BULK_CREATE_THOUGHTS_AND_CONNECTIONS');
