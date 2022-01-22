import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Thought } from '../store/rxdb/schemas/thought';
import { Selector } from 'react-redux';
import { RootState } from './';
import { bulkCreateThoughtsAndConnections } from './actions';

export const thoughtSelector: Selector<RootState, Thoughts> = (state) =>
  state.thoughts;
export type Thoughts = Thought[];

const initialState: Thoughts = [];

const sortThoughtsByLastUpdated = (
  { updated: leftUpdated }: Thought,
  { updated: rightUpdated }: Thought
) => {
  return rightUpdated - leftUpdated;
};

const thoughts = createSlice({
  name: 'thoughts',
  initialState,
  reducers: {
    setThoughts(_state, action: PayloadAction<Thoughts>) {
      return action.payload.sort(sortThoughtsByLastUpdated);
    },
    insert(state, action: PayloadAction<Thought>) {
      if ((window as any).batchingBulkThoughts) return state;
      return [action.payload, ...state];
    },
    remove(state, action: PayloadAction<string>) {
      return state.filter((thought) => thought.id !== action.payload);
    },
    update(state, action: PayloadAction<Thought>) {
      if ((window as any).batchingBulkThoughts) return state;
      return [
        action.payload,
        ...state.filter(({ id }) => id !== action.payload.id),
      ];
    },
  },
  extraReducers: builder => {
    builder.addCase(bulkCreateThoughtsAndConnections, (state, action) => {
      return [
        ...action.payload.thoughts,
        ...state,
      ];
    });
  }
});

export const { setThoughts, insert, remove, update } = thoughts.actions;

export default thoughts.reducer;
