import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Selector } from 'react-redux';
import { RootState } from './';

export const tutorialSelector: Selector<RootState, Tutorial> = state => state.tutorial;
export interface Tutorial {
  emphasizeButton: ButtonPositions;
}

export enum ButtonPositions {
  Left,
  LeftAlt,
  Middle,
  MiddleAlt,
  Right,
  RightAlt,
}

const initialState: Tutorial = {
  emphasizeButton: null,
};

const tutorial = createSlice({
  name: 'tutorial',
  initialState,
  reducers: {
    emphasizeButton(state, action: PayloadAction<ButtonPositions>) {
      state.emphasizeButton = action.payload;
    },
  }
});

export const {
  emphasizeButton,
} = tutorial.actions;

export default tutorial.reducer;
