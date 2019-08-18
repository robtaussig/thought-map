import './App.css';
import { createMuiTheme, responsiveFontSizes, Theme } from '@material-ui/core/styles';

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
  'A400': '#BADA55',
};

// /* DARK GREEN */
// const secondaryColor = {
//   0: '#E8F3EE',
//   100: '#BBDCCD',
//   200: '#8FC5AC',
//   300: '#629E8B',
//   400: '#35976A',
//   500: '#09814A',
//   600: '#086A36',
//   700: '#065330',
//   800: '#053B22',
//   900: '#032415',
//   'A400': '#09814A',
// };

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
  'A400': '#2978E8',
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
  'A400': '#2f2f2f',
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
  'A400': '#A10B00',
};

const CAST_SHADOW_HEAVY = {
  boxShadow: '0px 0px 20px -3px black',
};

const CAST_SHADOW_LIGHT = {
  boxShadow: '0px 0px 5px -1px black',
};

export const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: primaryColor,
      secondary: secondaryColor,
      //@ts-ignore
      gray: grays,
      red: reds,
    },
    status: {
      danger: 'orange',
    },
    defaults: {
      centered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      castShadow: {
        heavy: CAST_SHADOW_HEAVY,
        light: CAST_SHADOW_LIGHT,
      },
      underlineInput: {
        position: 'relative',
        '& > input': {
          width: '100%',
          backgroundColor: 'transparent',
          border: '1px solid transparent',
          borderBottomColor: 'hsla(341, 97%, 59%, 0.2)',
        },
        '& > input:focus': {
          outline: 'none',
        },
        '& > span': {
          position: 'absolute',
          bottom: 0,
          left: '50%',
          width: '100%',
          height: 1,
          opacity: 0,
          backgroundColor: '#bada55',
          transformOrigin: 'center',
          transform: 'translate(-50%, 0) scaleX(0)',
          transition: 'all 0.3s ease',
        },
        '& > input:focus ~ span': {
          transform: 'translate(-50%, 0) scaleX(1)',
          opacity: 1,
        },
      },
      circleButton: {
        position: 'fixed',
        border: `2px solid ${primaryColor[500]}`,
        margin: 20,
        height: 70,
        width: 70,
        borderRadius: '50%',
        backgroundColor: grays[600],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.1s linear',
        color: 'white',
        ...CAST_SHADOW_HEAVY,
        '&:not([disabled])': {
          '&:hover': {
            transform: 'scale(1.1)',
            ...CAST_SHADOW_HEAVY,
          },
          '&:active': {
            transform: 'scale(1)',
            boxShadow: 'none',
          },
          '&.touched': {
            boxShadow: 'none!important',
            transform: 'scale(0.9)!important',
          },
        },
      }      
    },
  })
);

export const styles = (theme: Theme) => ({
  root: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
});
