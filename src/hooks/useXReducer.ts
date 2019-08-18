import { useCallback, useRef, useReducer, useMemo, Dispatch, Reducer } from 'react';

export type Action = {
  type: any,
  payload: any,
}

type State = {
  [key: string]: State
} | any

type SetterParam<T> = (prevState: T) => T | T

export type Setter<T> = (setterParam: SetterParam<T>) => T;

const keyToActionType = (key: string): string => {
  return `@SET_${key}_DISPATCHED_X_ACTION`;
};

export const useNestedXReducer = (key: string, state: State, dispatch: Dispatch<Action>): [State, Setter<State>] => {
  const stateRef = useRef<State>();
  const setter: Setter<State> = useCallback(valOrFn => {
    const actionType = keyToActionType(key);
    const next = typeof valOrFn === 'function' ? valOrFn(stateRef.current) : valOrFn;
    dispatch({
      type: actionType,
      payload: next,
    });
  }, []);
  
  stateRef.current = key === '*' ? state : state[key];
  return [stateRef.current, setter];
};

export const useXReducer = (defaultState: State, mergedReducer: Reducer<State, Action>): [State, Dispatch<Action>] => {
  const reducer = useMemo(() => createNestedReducer(mergedReducer), []);
  return useReducer(reducer, defaultState);
};

export const actionTypeToKey = (actionType: string): string => {
  if (/^@SET_/.test(actionType)) {
    return actionType.split('_')[1];
  }
};

const createNestedReducer = (mergedReducer: Reducer<State, Action>): Reducer<State, Action> => {
  return (state, action) => {
    const key = actionTypeToKey(action.type);
    if (key) {
      if (key === '*') {
        return {
          ...state,
          ...action.payload,
        };
      } else {
        return {
          ...state,
          [key]: action.payload,
        };
      }
    } else if (mergedReducer) {
      return mergedReducer(state, action);
    }
    return state;
  };
};

export default useXReducer;
