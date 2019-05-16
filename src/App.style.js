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
    },
  })
);

export const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
});
