import { intoMap } from '../lib/util';

export const DEFAULT_STATE = {
  thoughts: [],
  connections: [],
  plans: [],
  phases: {},
  notes: [],
  tags: [],
  creatingPlan: false,
  inputtedPlan: '',
};

export const ACTION_TYPES = {
  PHASE_PENDING: 'PHASE_PENDING',
  INITIALIZE_APPLICATION: 'INITIALIZE_APPLICATION',
  FETCH_THOUGHTS: 'FETCH_THOUGHTS',
  FETCH_THOUGHT: 'FETCH_THOUGHT',
  CREATE_THOUGHT: 'CREATE_THOUGHT',
  DELETE_THOUGHT: 'DELETE_THOUGHT',
  UPDATE_THOUGHT: 'UPDATE_THOUGHT',
  CREATING_PLAN: 'CREATING_PLAN',
};

const PHASE_TYPES = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

export const appReducer = (state, action) => {

  switch (action.type) {
    case ACTION_TYPES.PHASE_PENDING:
      return {
        ...state,
        phases: {
          ...state.phases,
          [action.payload]: PHASE_TYPES.PENDING,
        },
      };

    case ACTION_TYPES.INITIALIZE_APPLICATION:
      return {
        ...state,
        phases: {
          ...state.phases,
          [ACTION_TYPES.INITIALIZE_APPLICATION]: PHASE_TYPES.SUCCESS,
        },
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
        inputtedPlan: '',
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
