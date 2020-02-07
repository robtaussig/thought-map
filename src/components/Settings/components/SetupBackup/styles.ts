import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: any) => ({
  root: {
    
  },
  header: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 20,
  },
  inputForm: {
    display: 'flex',
  },
  inputLabel: {
    display: 'flex',
    flexDirection: 'column-reverse',
    flex: 1,
    '&#id-input': {

    },
    '&#password-input': {

    },
  },
  nextButton: {
    marginLeft: 30,
    fontWeight: 600,
    color: theme.palette.secondary[600],
    '&:disabled': {
      color: '#ccc',
    },
  },
  submitButton: {
    marginLeft: 30,
    fontWeight: 600,
    color: theme.palette.secondary[600],
  },
  textAreaLabel: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    '& > textarea': {
      resize: 'none',
    },
    '&#private-key-textarea': {

    },
  },
  errorMessage: {
    color: theme.palette.negative[500],
  },
}));
