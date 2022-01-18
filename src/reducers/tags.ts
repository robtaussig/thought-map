import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tag } from '../store/rxdb/schemas/tag';
import { Selector } from 'react-redux';
import { RootState } from './';

export const tagSelector: Selector<RootState, Tags> = state => state.tags;
export interface Tags {
  [tagId: string]: Tag,
}

const initialState: Tags = {};

const tags = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setTags(state, action: PayloadAction<Tags>) {
      return action.payload;
    },
    insert(state, action: PayloadAction<Tag>) {
      state[action.payload.id] = action.payload;
    },
    remove(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
    update(state, action: PayloadAction<Tag>) {
      state[action.payload.id] = action.payload;
    },
  }
});

export const {
  setTags,
  insert,
  remove,
  update,
} = tags.actions;

export default tags.reducer;
