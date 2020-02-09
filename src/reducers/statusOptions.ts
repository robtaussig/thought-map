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
  extraReducers: {
    [setCustomObjects as any]: (state, action: PayloadAction<CustomObject[]>) => {
      return state.concat(
        action.payload
          .filter(({ type }) => {
            return type === CustomObjectType.Tag;
          })
          .map(({ value }) => value)
      );
    },
    [insert as any]: (state, action: PayloadAction<CustomObject>) => {
      if (action.payload.type === CustomObjectType.Tag) {
        return state.concat(action.payload.value);
      }
    },
    [remove as any]: (state, action: PayloadAction<CustomObject>) => {
      if (action.payload.type === CustomObjectType.Tag) {
        return state.filter(prev => prev !== action.payload.value);
      }
    },
  },
});

export const {

} = statusOptions.actions;

export default statusOptions.reducer;
