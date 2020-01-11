import { makeStyles } from '@material-ui/styles';
import { CustomTheme } from '../../../../reducers/customTheme';

export const useStyles = makeStyles<CustomTheme>((theme: any) => ({
  container: () => ({
    position: 'fixed',
    height: '100%',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: theme.palette.background[500],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.2s ease-out',
    zIndex: 99999,
    '&.hidden': {
      '& #submit': {
        display: 'none',
      }
    }
  }),
  header: () => ({
    flex: '0 0 80px',
    backgroundColor: theme.palette.primary[500],
    boxShadow: '0px 0px 5px 0px black',
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontSize: 24,
  }),
  button: () => ({
    border: '2px solid white',
    padding: '3px 0',
    marginTop: 40,
    width: '70%',
    borderRadius: '3px',
    backgroundColor: theme.palette.background[500],
    color: 'white',
    '&:active': {
      backgroundColor: theme.palette.background[700],
      boxShadow: 'none!important',
    },
    '&:disabled': {
      backgroundColor: theme.palette.background[300],
      color: 'white',
    },
    '&:not(:disabled)': {
      boxShadow: '0px 0px 5px 2px black',
    }
  }),
  circleButton: () => ({
    ...theme.defaults.circleButton,
    '&#close': {
      left: 10,
      bottom: 10,
    },
    '&#reset': {
      right: 10,
      bottom: 10,
      color: theme.palette.red[300],
      borderColor: theme.palette.red[300],
    },
  }),
  saveButton: () => ({
    margin: '50px auto',
    borderRadius: 5,
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: theme.palette.primary[800],
    color: theme.palette.primary[200],
    border: `2px solid ${theme.palette.primary[200]}`,
  }),
}));
