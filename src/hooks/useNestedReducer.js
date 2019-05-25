import { useCallback, useRef } from 'react';

const keyToActionType = key => {
  return `@SET_${key}_DISPATCHED_ACTION`;
};

export const useNestedReducer = (key, state, dispatch) => {
  const stateRef = useRef({});
  const actionType = keyToActionType(key);
  
  const setter = useCallback(valOrFn => {
    const next = typeof valOrFn === 'function' ? valOrFn(stateRef.current) : valOrFn;
    dispatch({
      type: actionType,
      payload: next,
    });
  }, []);
  
  stateRef.current = state[key];
  return [stateRef.current, setter];
};

export const actionToKey = action => {
  return action.split('_')[1];
};

export const createNestedReducer = () => {
  return (state, action) => {
    const key = actionToKey(action.type);

    return {
      ...state,
      [key]: action.payload,
    };
  };
};
