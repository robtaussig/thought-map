import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Selector } from 'react-redux';
import { RootState } from './';
import {
  setCustomObjects,
  insert,
  remove,
} from './customObjects';
import { CustomObject, CustomObjectType } from '../store/rxdb/schemas/customObject';

export const typeOptionsSelector: Selector<RootState, string[]> = state => state.typeOptions;

const initialState: string[] = ['Task', 'Todo', 'Reminder', 'Misc', 'Collection'];

const typeOptions = createSlice({
  name: 'typeOptions',
  initialState,
  reducers: {

  },
  extraReducers: {
    [setCustomObjects as any]: (state, action: PayloadAction<CustomObject[]>) => {
      return state.concat(
        action.payload
          .filter(({ type }) => {
            return type === CustomObjectType.Type;
          })
          .map(({ value }) => value)
      );
    },
    [insert as any]: (state, action: PayloadAction<CustomObject>) => {
      if (action.payload.type === CustomObjectType.Type) {
        return state.concat(action.payload.value);
      }
    },
    [remove as any]: (state, action: PayloadAction<CustomObject>) => {
      if (action.payload.type === CustomObjectType.Type) {
        return state.filter(prev => prev !== action.payload.value);
      }
    },
  },
});

export const {

} = typeOptions.actions;

export default typeOptions.reducer;
