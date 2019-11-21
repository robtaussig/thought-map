import { combineReducers } from '@reduxjs/toolkit'
import connections from './connections';
import notes from './notes';
import pictures from './pictures';
import plans from './plans';
import settings from './settings';
import sortFilterSettings from './sortFilterSettings';
import statuses from './statuses';
import statusesByThought from './statusesByThought';
import tags from './tags';
import templates from './templates';
import thoughts from './thoughts';

const rootReducer = combineReducers({
  connections,
  notes,
  pictures,
  plans,
  settings,
  sortFilterSettings,
  statuses,
  statusesByThought,
  tags,
  templates,
  thoughts,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
