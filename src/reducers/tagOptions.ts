import { createSlice } from '@reduxjs/toolkit';
import { Selector } from 'react-redux';
import { RootState } from './';
import { insert, remove, setCustomObjects } from './customObjects';
import { CustomObjectType } from '../store/rxdb/schemas/customObject';

export const tagOptionsSelector: Selector<RootState, string[]> = (state) =>
  state.tagOptions;

const initialState: string[] = ['Important', 'Misc', 'Later'];

const tagOptions = createSlice({
  name: 'tagOptions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setCustomObjects, (state, action) => {
      return state.concat(
        action.payload
          .filter(({ type }) => {
            return type === CustomObjectType.Tag;
          })
          .map(({ value }) => value)
      );
    });
    builder.addCase(insert, (state, action) => {
      if (action.payload.type === CustomObjectType.Tag) {
        return state.concat(action.payload.value);
      }
    });
    builder.addCase(remove, (state, action) => {
      if (action.payload.type === CustomObjectType.Tag) {
        return state.filter((prev) => prev !== action.payload.value);
      }
    });
  },
});

export default tagOptions.reducer;
