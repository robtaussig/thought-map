import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Picture } from '../store/rxdb/schemas/picture';
import { Selector } from 'react-redux';
import { RootState } from './';

export const pictureSelector: Selector<RootState, Pictures> = state => state.pictures;
export interface Pictures {
  [pictureId: string]: Picture;
}

const initialState: Pictures = {};

const pictures = createSlice({
  name: 'pictures',
  initialState,
  reducers: {
    setPictures(state, action: PayloadAction<Pictures>) {
      return action.payload
    },
    insert(state, action: PayloadAction<Picture>) {
      state[action.payload.id] = action.payload;
    },
    remove(state, action: PayloadAction<Picture>) {
      delete state[action.payload.id];
    },
    update(state, action: PayloadAction<Picture>) {
      state[action.payload.id] = action.payload;
    },
  }
});

export const {
  setPictures,
  insert,
  remove,
  update,
} = pictures.actions;

export default pictures.reducer;
