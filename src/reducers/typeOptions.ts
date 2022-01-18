import { createSlice } from '@reduxjs/toolkit';
import { Selector } from 'react-redux';
import { RootState } from './';
import { insert, remove, setCustomObjects } from './customObjects';
import { CustomObjectType } from '../store/rxdb/schemas/customObject';

export const typeOptionsSelector: Selector<RootState, string[]> = (state) =>
  state.typeOptions;

const initialState: string[] = [
  'Task',
  'Todo',
  'Reminder',
  'Misc',
  'Collection',
];

const typeOptions = createSlice({
  name: 'typeOptions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setCustomObjects, (state, action) => {
      return state.concat(
        action.payload
          .filter(({ type }) => {
            return type === CustomObjectType.Type;
          })
          .map(({ value }) => value)
      );
    });
    builder.addCase(insert, (state, action) => {
      if (action.payload.type === CustomObjectType.Type) {
        return state.concat(action.payload.value);
      }
    });
    builder.addCase(remove, (state, action) => {
      if (action.payload.type === CustomObjectType.Type) {
        return state.filter((prev) => prev !== action.payload.value);
      }
    });
  },
});

export default typeOptions.reducer;
