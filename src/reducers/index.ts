import { Reducer } from 'react';
import { Thought } from '../store/rxdb/schemas/thought';
import { Template } from '../store/rxdb/schemas/template';
import { Connection } from '../store/rxdb/schemas/connection';
import { Plan } from '../store/rxdb/schemas/plan';
import { Note } from '../store/rxdb/schemas/note';
import { Tag } from '../store/rxdb/schemas/tag';

export interface Notes {
  [noteId: string]: Note,
}

export interface Tags {
  [tagId: string]: Tag,
}

export interface AppState {
  thoughts: Thought[],
  templates: Template[],
  connections: Connection[],
  plans: Plan[],
  notes: Notes,
  tags: Tags,
  creatingPlan: boolean,
}

enum ActionType {
  INITIALIZE_APPLICATION = 'INITIALIZE_APPLICATION',
  FETCH_THOUGHTS = 'FETCH_THOUGHTS',
  FETCH_THOUGHT = 'FETCH_THOUGHT',
  CREATE_THOUGHT = 'CREATE_THOUGHT',
  DELETE_THOUGHT = 'DELETE_THOUGHT',
  UPDATE_THOUGHT = 'UPDATE_THOUGHT',
  CREATING_PLAN = 'CREATING_PLAN',
}

interface Action {
  type: ActionType,
  payload: any,
}

export const DEFAULT_STATE: AppState = {
  thoughts: [],
  templates: [],
  connections: [],
  plans: [],
  notes: {},
  tags: {},
  creatingPlan: false,
};

export const ACTION_TYPES = {
  INITIALIZE_APPLICATION: 'INITIALIZE_APPLICATION',
  FETCH_THOUGHTS: 'FETCH_THOUGHTS',
  FETCH_THOUGHT: 'FETCH_THOUGHT',
  CREATE_THOUGHT: 'CREATE_THOUGHT',
  DELETE_THOUGHT: 'DELETE_THOUGHT',
  UPDATE_THOUGHT: 'UPDATE_THOUGHT',
  CREATING_PLAN: 'CREATING_PLAN',
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

    case ACTION_TYPES.CREATING_PLAN:
      return {
        ...state,
        creatingPlan: action.payload,
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
