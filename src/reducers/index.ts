import { Reducer } from 'react';
import { Thought } from '../store/rxdb/schemas/thought';
import { Template } from '../store/rxdb/schemas/template';
import { Connection } from '../store/rxdb/schemas/connection';
import { Plan } from '../store/rxdb/schemas/plan';
import { Note } from '../store/rxdb/schemas/note';
import { Tag } from '../store/rxdb/schemas/tag';
import { Picture } from '../store/rxdb/schemas/picture';
import { Setting } from '../store/rxdb/schemas/setting';
import { Status } from '../store/rxdb/schemas/status';

export interface Notes {
  [noteId: string]: Note;
}

export interface Statuses {
  [statusId: string]: Status;
}

export interface Pictures {
  [pictureId: string]: Picture;
}

export interface Tags {
  [tagId: string]: Tag;
}

export interface Settings {
  [field: string]: Setting;
}

export interface StatusesByThought {
  [thoughtId: string]: string[];
}

export interface AppState {
  thoughts: Thought[];
  templates: Template[];
  connections: Connection[];
  pictures: Pictures;
  plans: Plan[];
  notes: Notes;
  statuses: Statuses;
  statusesByThought: StatusesByThought;
  tags: Tags;
  settings: Settings;
  notificationDisabled: boolean;
  sortFilterSettings: SortFilterSettings;
}

enum ActionType {
  INITIALIZE_APPLICATION = 'INITIALIZE_APPLICATION',
  FETCH_THOUGHTS = 'FETCH_THOUGHTS',
  FETCH_THOUGHT = 'FETCH_THOUGHT',
  CREATE_THOUGHT = 'CREATE_THOUGHT',
  DELETE_THOUGHT = 'DELETE_THOUGHT',
  UPDATE_THOUGHT = 'UPDATE_THOUGHT',
}

interface Action {
  type: ActionType;
  payload: any;
}

export type SortFilterField = 'title' | 'status' | 'type';

export interface SortFilterSettings {
  field?: SortFilterField;
  desc?: boolean;
}

export const DEFAULT_STATE: AppState = {
  thoughts: [],
  templates: [],
  connections: [],
  plans: [],
  pictures: {},
  notes: {},
  tags: {},
  statuses: {},
  statusesByThought: {},
  settings: {},
  notificationDisabled: false,
  sortFilterSettings: {},
};

export const ACTION_TYPES = {
  INITIALIZE_APPLICATION: 'INITIALIZE_APPLICATION',
  FETCH_THOUGHTS: 'FETCH_THOUGHTS',
  FETCH_THOUGHT: 'FETCH_THOUGHT',
  CREATE_THOUGHT: 'CREATE_THOUGHT',
  DELETE_THOUGHT: 'DELETE_THOUGHT',
  UPDATE_THOUGHT: 'UPDATE_THOUGHT',
};

export const appReducer: Reducer<AppState, Action> = (state, action) => {

  switch (action.type) {
    case ACTION_TYPES.INITIALIZE_APPLICATION:
      return {
        ...state,
        ...action.payload,
      };

    case ACTION_TYPES.FETCH_THOUGHTS:
      return {
        ...state,
        thoughts: action.payload,
      };

    case ACTION_TYPES.FETCH_THOUGHT:
    case ACTION_TYPES.CREATE_THOUGHT:
    case ACTION_TYPES.DELETE_THOUGHT:
    case ACTION_TYPES.UPDATE_THOUGHT:
      return state;
    default:
      return state;
  }
};
