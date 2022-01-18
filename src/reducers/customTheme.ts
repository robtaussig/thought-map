import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Selector } from 'react-redux';
import { RootState } from './';
import { setSettings } from './settings';
import { CSSProperties } from 'react';

export const SHADE_OPTIONS: [Shades, number][] = [
  [0, 240],
  [100, 180],
  [200, 130],
  [300, 80],
  [400, 40],
  [500, 0],
  [600, -40],
  [700, -80],
  [800, -120],
  [900, -160],
  ['A400', 0],
];

/* LIGHT GREEN */
const primaryColor = {
  0: '#F8FBEF',
  100: '#E5F1C1',
  200: '#D9EAA2',
  300: '#CCE483',
  400: '#C6E073',
  500: '#BADA55',
  600: '#99B346',
  700: '#66772F',
  800: '#44503E',
  900: '#222810',
  A400: '#BADA55',
};

/* Blue */
const secondaryColor = {
  0: '#EBF3FF',
  100: '#B2D2FF',
  200: '#8CBBFF',
  300: '#539AFF',
  400: '#2D84FF',
  500: '#2978E8',
  600: '#2161BA',
  700: '#19488C',
  800: '#11305D',
  900: '#09182F',
  A400: '#2978E8',
};

const grays = {
  0: '#F9F9F9',
  100: '#F6F6F6',
  200: '#ECECEC',
  300: '#A0A0A0',
  400: '#7A7A7A',
  500: '#545454',
  600: '#2f2f2f',
  700: '#272727',
  800: '#161616',
  900: '#0D0D0D',
  A400: '#2f2f2f',
};

const reds = {
  0: '#F4D3D0',
  100: '#E9A7A2',
  200: '#DE7B73',
  300: '#D44F45',
  400: '#C40D00',
  500: '#A10B00',
  600: '#7D0900',
  700: '#5A0600',
  800: '#360400',
  900: '#240300',
  A400: '#A10B00',
};

export const customThemeSelector: Selector<RootState, CustomTheme> = (state) =>
  state.customTheme;
export enum PaletteOptions {
  Primary = 'primary',
  Secondary = 'secondary',
  Background = 'background',
  Negative = 'negative',
}

export type Shades =
  | 0
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 'A400';
export type PaletteShades = Record<Shades, string>;
export type Palette = Record<PaletteOptions, PaletteShades>;

export interface CustomTheme {
  palette?: Palette;
  useDarkMode?: boolean;
  defaults?: {
    [key: string]: CSSProperties;
  };
}

const savedCustomTheme = localStorage.getItem('customTheme');

const defaultState = {
  palette: {
    primary: primaryColor,
    secondary: secondaryColor,
    background: grays,
    negative: reds,
  },
  useDarkMode: false,
  defaults: {
    circleButton: {
      border: `2px solid ${primaryColor[500]}`,
      backgroundColor: grays[600],
    },
  },
};

const initialState: CustomTheme = savedCustomTheme
  ? JSON.parse(savedCustomTheme)
  : defaultState;

const customTheme = createSlice({
  name: 'customTheme',
  initialState,
  reducers: {
    updatePalette: (
      state,
      action: PayloadAction<[PaletteOptions, PaletteShades]>
    ) => {
      const [colorType, value] = action.payload;
      state.palette[colorType] = value;
    },
    resetDefault: () => defaultState,
    toggleDarkMode: (state, action: PayloadAction<boolean>) => {
      state.useDarkMode =
        action.payload === undefined ? !state.useDarkMode : action.payload;

      const previous = { ...state.palette.background };
      SHADE_OPTIONS.slice(0, SHADE_OPTIONS.length - 1).forEach(
        ([shade], idx) => {
          const opposite = SHADE_OPTIONS[SHADE_OPTIONS.length - 2 - idx][0];
          state.palette.background[shade] = previous[opposite];
        }
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setSettings, (_state, action: any) => {
      if (action.payload.customTheme) {
        return action.payload.customTheme;
      }
    });
  },
});

export const { updatePalette, resetDefault, toggleDarkMode } =
  customTheme.actions;

export default customTheme.reducer;
