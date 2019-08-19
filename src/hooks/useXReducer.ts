import { useCallback, useRef, useReducer, useMemo, Dispatch, Reducer } from 'react';

export type Action = {
  type: any,
  payload: any,
}

type Key = string | number | symbol;

type SetterParam<T> = (prevState: T) => T | T;

export type Setter<T> = (setterParam: SetterParam<T>) => void;

const keyToActionType = (key: Key): string => {
  return `@SET_${String(key)}_DISPATCHED_X_ACTION`;
};

export const useNestedXReducer = <T extends { [key: string]: any }, K extends keyof T>(key: K, state: T, dispatch: Dispatch<Action>): [T[K], Setter<T[K]>] => {
  const stateRef = useRef<T[K]>();
  const setter: Setter<T[K]> = useCallback(valOrFn => {
    const actionType = keyToActionType(key);
    const next = typeof valOrFn === 'function' ? valOrFn(stateRef.current) : valOrFn;
    dispatch({
      type: actionType,
      payload: next,
    });
  }, []);
  
  stateRef.current = state[key];
  return [stateRef.current, setter];
};

export const useXReducer = <T>(defaultState: T, mergedReducer: Reducer<T, Action>): [T, Dispatch<Action>] => {
  const reducer = useMemo(() => createNestedReducer(mergedReducer), []);
  return useReducer(reducer, defaultState);
};

export const actionTypeToKey = (actionType: string): (string | undefined) => {
  if (/^@SET_/.test(actionType)) {
    return actionType.split('_')[1];
  }
};

const createNestedReducer = <T>(mergedReducer: Reducer<T, Action>): Reducer<T, Action> => {
  return (state, action) => {
    const key = actionTypeToKey(action.type);
    if (key) {
      return {
        ...state,
        [key]: action.payload,
      };
    } else if (mergedReducer) {
      return mergedReducer(state, action);
    }
    return state;
  };
};

export default useXReducer;
