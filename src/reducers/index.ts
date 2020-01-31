import { combineReducers } from '@reduxjs/toolkit'
import connections from './connections';
import notes from './notes';
import pictures from './pictures';
import plans from './plans';
import settings from './settings';
import sortFilterSettings from './sortFilterSettings';
import statuses from './statuses';
import statusesByThought from './statusesByThought';
import displayThoughtSettings from './displayThoughtSettings';
import displayPriorities from './displayPriorities';
import tags from './tags';
import templates from './templates';
import thoughts from './thoughts';
import stage from './stage';
import tutorial from './tutorial';
import backups from './backups';
import customTheme from './customTheme';
import mergeResults from './mergeResults';

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
  stage,
  displayPriorities,
  displayThoughtSettings,
  tutorial,
  customTheme,
  backups,
  mergeResults,
});

export type RootState = ReturnType<typeof rootReducer>;

const appReducer: typeof rootReducer = (state, action) => {
  if (action.type === 'RESET') return rootReducer(undefined, action);
  return rootReducer(state, action);
};

export default appReducer;
