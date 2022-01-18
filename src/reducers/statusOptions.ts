import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Selector } from 'react-redux';
import { RootState } from './';
import {
  setCustomObjects,
  insert,
  remove,
} from './customObjects';
import { CustomObject, CustomObjectType } from '../store/rxdb/schemas/customObject';

export const statusOptionsSelector: Selector<RootState, string[]> = state => state.statusOptions;

const initialState: string[] = ['new', 'in progress', 'won\'t fix', 'completed'];

const statusOptions = createSlice({
  name: 'statusOptions',
  initialState,
  reducers: {

  },
  extraReducers: builder => {
    builder.addCase(setCustomObjects, (state, action) => {
      return state.concat(
        action.payload
          .filter(({ type }) => {
            return type === CustomObjectType.Status;
          })
          .map(({ value }) => value)
      );
    });
    builder.addCase(insert, (state, action) => {
      if (action.payload.type === CustomObjectType.Status) {
        return state.concat(action.payload.value);
      }
    });
    builder.addCase(remove, (state, action) => {
      if (action.payload.type === CustomObjectType.Status) {
        return state.filter(prev => prev !== action.payload.value);
      }
    });
  },
});

export const {

} = statusOptions.actions;

export default statusOptions.reducer;
