import { useCallback, useRef, useReducer, useMemo } from 'react';

const keyToActionType = key => {
  return `@SET_${key}_DISPATCHED_X_ACTION`;
};

export const useNestedXReducer = (key, state, dispatch) => {
  const stateRef = useRef();
  const setter = useCallback(valOrFn => {
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

export const useXReducer = (defaultState, mergedReducer) => {
  const reducer = useMemo(() => createNestedReducer(mergedReducer), []);
  return useReducer(reducer, defaultState);
};

export const actionTypeToKey = actionType => {
  if (/^@SET_/.test(actionType)) {
    return actionType.split('_')[1];
  }
};

export const createNestedReducer = mergedReducer => {
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
