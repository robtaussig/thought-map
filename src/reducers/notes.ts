import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Note } from '../store/rxdb/schemas/note';
import { Selector } from 'react-redux';
import { RootState } from './';

export const noteSelector: Selector<RootState, Notes> = state => state.notes;
export interface Notes {
  [noteId: string]: Note;
}

const initialState: Notes = {};

const notes = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes(state, action: PayloadAction<Notes>) {
      return action.payload;
    },
    insert(state, action: PayloadAction<Note>) {
      state[action.payload.id] = action.payload;
    },
    remove(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
    update(state, action: PayloadAction<Note>) {
      state[action.payload.id] = action.payload;
    },
  }
});

export const {
  setNotes,
  insert,
  remove,
  update,
} = notes.actions;

export default notes.reducer;
