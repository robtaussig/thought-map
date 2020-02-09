import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Selector } from 'react-redux';
import { RootState } from './';
import {
  setCustomObjects,
  insert,
  remove,
} from './customObjects';
import { CustomObject, CustomObjectType } from '../store/rxdb/schemas/customObject';

export const tagOptionsSelector: Selector<RootState, string[]> = state => state.tagOptions;

const initialState: string[] = ['Important', 'Misc', 'Later'];

const tagOptions = createSlice({
  name: 'tagOptions',
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

} = tagOptions.actions;

export default tagOptions.reducer;
