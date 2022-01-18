import { Comparable, Item } from '../types';
import { generateFieldsToPick, generateIntersectItem } from './util';

interface CompareState {
  fieldsToPick: string[];
  fieldsPicked: string[];
  customInput: CustomInput;
  left: Item;
  right: Item;
  merged: Item;
}

export interface CustomInput {
  [fieldName: string]: string;
}

export enum ActionTypes {
  SetState,
  Pick,
  InputCustom,
}

interface PickActionPayload {
  field: string;
  value: any;
}

interface InputCustomPayload {
  field: string;
  value: any;
}

type Action = {
  type: ActionTypes.SetState;
  payload: CompareState;
} | {
  type: ActionTypes.Pick;
  payload: PickActionPayload;
} | {
  type: ActionTypes.InputCustom;
  payload: InputCustomPayload;
}

export const INITIAL_STATE: CompareState = {
  fieldsToPick: [],
  fieldsPicked: [],
  customInput: {},
  left: null,
  right: null,
  merged: null,
};

export const generateInitialState = ([left, right]: Comparable): CompareState => ({
  fieldsToPick: generateFieldsToPick(left.item, right.item),
  fieldsPicked: [],
  left,
  right,
  customInput: {},
  merged: generateIntersectItem(left, right),
});

export const compareReducer = (state: CompareState, action: Action): CompareState => {
  switch (action.type) {
  case ActionTypes.SetState:
    return action.payload;

  case ActionTypes.Pick:
    return {
      ...state,
      fieldsToPick: state.fieldsToPick.filter(field => field !== action.payload.field),
      fieldsPicked: state.fieldsPicked.concat(action.payload.field),
      merged: {
        ...state.merged,
        item: {
          ...state.merged.item,
          [action.payload.field]: action.payload.value,
        },
      }
    };

  case ActionTypes.InputCustom:
    return {
      ...state,
      customInput: {
        ...state.customInput,
        [action.payload.field]: action.payload.value,
      },
      merged: {
        ...state.merged,
        item: {
          ...state.merged.item,
          [action.payload.field]: action.payload.value,
          updated: +new Date(),
        },
      }
    };
  
  default:
    throw new Error(`Unrecognized action: ${action}`);
  }
};
