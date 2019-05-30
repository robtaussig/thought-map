import './App.css';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

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

/* DARK GREEN */
const secondaryColor = {
  0: '#E8F3EE',
  100: '#BBDCCD',
  200: '#8FC5AC',
  300: '#629E8B',
  400: '#35976A',
  500: '#09814A',
  600: '#086A36',
  700: '#065330',
  800: '#053B22',
  900: '#032415',
  'A400': '#09814A',
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

export const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: primaryColor,
      secondary: secondaryColor,
      gray: grays,
      red: reds,
    },
    status: {
      danger: 'orange',
    },
    defaults: {
      castShadow: {
        heavy: {
          boxShadow: '0px 0px 20px -3px black',
        },
        light: {
          boxShadow: '0px 0px 5px -1px black',
        },
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
      bubbleButton: {
        zIndex: 1,
        position: 'relative',
        fontSize: 'inherit',
        fontFamily: 'inherit',
        color: 'white',
        padding: '0.5em 1em',
        outline: 'none',
        border: 'none',
        backgroundColor: 'hsl(236, 32%, 26%)',
        overflow: 'hidden',
        transition: 'color 0.4s ease-in-out',
        '&::before': {
          content: '""',
          zIndex: -1,
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1em',
          height: '1em',
          borderRadius: '50%',
          backgroundColor: '#3cefff',
          transformOrigin: 'center',
          transform: 'translate(-50%, -50%) scale(0)',
          transition: 'transform 0.45s ease-in-out',
        },
        '&:hover': {
          cursor: 'pointer',
          color: '#161616',
        },
        '&:hover::before': {
          transform: 'translate(-50%, -50%) scale(15)',
        },
      },
    },
  })
);

export const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
});
