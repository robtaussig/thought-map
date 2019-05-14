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
  })
);

export const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
  },
});
