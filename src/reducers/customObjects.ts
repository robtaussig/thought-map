import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CustomObject } from '../store/rxdb/schemas/customObject';
import { Selector } from 'react-redux';
import { RootState } from './';

export const customObjectSelector: Selector<RootState, CustomObject[]> = state => state.customObjects;

const initialState: CustomObject[] = [];

const customObjects = createSlice({
  name: 'customObjects',
  initialState,
  reducers: {
    setCustomObjects(state, action: PayloadAction<CustomObject[]>) {
      return action.payload;
    },
    insert(state, action: PayloadAction<CustomObject>) {
      return state.concat(action.payload);
    },
    remove(state, action: PayloadAction<CustomObject>) {
      return state.filter(({ id }) => id !== action.payload.id);
    },
    update(state, action: PayloadAction<CustomObject>) {
      return state.map(prev => prev.id === action.payload.id ? action.payload : prev);
    },
  }
});

export const {
  setCustomObjects,
  insert,
  remove,
  update,
} = customObjects.actions;

export default customObjects.reducer;
