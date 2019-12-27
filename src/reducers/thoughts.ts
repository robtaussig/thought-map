import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Thought } from '../store/rxdb/schemas/thought';
import { Selector } from 'react-redux';
import { RootState } from './';

export const thoughtSelector: Selector<RootState, Thoughts> = state => state.thoughts;
export type Thoughts = Thought[];

const initialState: Thoughts = [];

const sortThoughtsByLastUpdated = ({ updated: leftUpdated }: Thought, { updated: rightUpdated }: Thought) => {
  return rightUpdated - leftUpdated;
};

const thoughts = createSlice({
  name: 'thoughts',
  initialState,
  reducers: {
    setThoughts(state, action: PayloadAction<Thoughts>) {
      return action.payload.sort(sortThoughtsByLastUpdated);
    },
    insert(state, action: PayloadAction<Thought>) {
      return state.concat(action.payload).sort(sortThoughtsByLastUpdated);
    },
    remove(state, action: PayloadAction<Thought>) {
      return state.filter(thought => thought.id !== action.payload.id);
    },
    update(state, action: PayloadAction<Thought>) {
      return state.map(thought => thought.id == action.payload.id ? action.payload : thought).sort(sortThoughtsByLastUpdated);
    },
  },
});

export const {
  setThoughts,
  insert,
  remove,
  update,
} = thoughts.actions;

export default thoughts.reducer;
