import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Thought } from '../store/rxdb/schemas/thought';
import { Status } from '../store/rxdb/schemas/status';
import { Selector } from 'react-redux';
import { RootState } from './';

export const thoughtSelector: Selector<RootState, Thoughts> = state => state.thoughts;
export type Thoughts = Thought[];

const initialState: Thoughts = [];

const thoughts = createSlice({
  name: 'thoughts',
  initialState,
  reducers: {
    setThoughts(state, action: PayloadAction<Thoughts>) {
      return action.payload;
    },
    insert(state, action: PayloadAction<Thought>) {
      return state.concat(action.payload);
    },
    remove(state, action: PayloadAction<Thought>) {
      return state.filter(thought => thought.id !== action.payload.id);
    },
    update(state, action: PayloadAction<Thought>) {
      return state.map(thought => thought.id == action.payload.id ? action.payload : thought);
    },
    updateStatus(state, action: PayloadAction<Status>) {
      return state.map(thought => {
        if (thought.id === action.payload.thoughtId) {
          return {
            ...thought,
            status: action.payload.text,
          };
        }
        return thought;
      });
    }
  }
});

export const {
  setThoughts,
  insert,
  remove,
  update,
  updateStatus,
} = thoughts.actions;

export default thoughts.reducer;
