import { Comparable, Item } from '../types';
import { generateFieldsToPick, generateIntersectItem } from './util';

interface CompareState {
  fieldsToPick: string[];
  fieldsPicked: string[];
  left: Item;
  right: Item;
  merged: Item;
}

enum ActionTypes {
  Pick,
}

interface PickActionPayload {
  field: string;
  value: any;
}

type Action = {
  type: ActionTypes.Pick;
  payload: PickActionPayload;
}

export const generateInitialState = ([left, right]: Comparable): CompareState => ({
  fieldsToPick: generateFieldsToPick(left.item, right.item),
  fieldsPicked: [],
  left,
  right,
  merged: generateIntersectItem(left, right),
});

export const compareReducer = (state: CompareState, action: Action): CompareState => {
  switch (action.type) {
    case ActionTypes.Pick:
      return {
        ...state,
        fieldsToPick: state.fieldsToPick.filter(field => field !== action.payload.field),
        fieldsPicked: state.fieldsPicked.concat(action.payload.field),
        merged: {
          ...state.merged,
          [action.payload.field]: action.payload.value,
        }
      };
  
    default:
      throw new Error(`Unrecognized action: ${action}`);
  }
};
