import './App.css';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

export const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: blue,
      secondary: red,
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
      }
    },
  })
);

export const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
});
