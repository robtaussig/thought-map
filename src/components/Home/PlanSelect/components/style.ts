import { StyleRules } from '@material-ui/core/styles';

export interface DefaultState {
  top: number,
  left: number,
  right: number,
  bottom: number,
  borderRadius: string,
  justifyContent: string,
}

export const DEFAULT_STATE: DefaultState = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '10px',
  justifyContent: 'center',
};

export const styles = (theme: any): StyleRules => ({
  root: {
    position: 'absolute',
    ...DEFAULT_STATE,
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.4s ease-out',
    backgroundColor: '#8380ff',
    visibility: 'hidden',
    '&.with-thoughts': {
      '& #plan-name': {
        alignItems: 'flex-start',
        flex: 0,
        marginBottom: 80,        
      },
      '& #with-thoughts': {
        top: 62,
      },
    },
  },
  header: {
    color: 'white',
    fontSize: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 50px',
  },
  inputLabel: {
    ...theme.defaults.centered,
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
    marginBottom: 100,
    '& input': {
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '1px solid black',
      width: '80vw',
      fontSize: 24,
      padding: 5,
      [theme.breakpoints.up('sm')]: {
        width: 270,
      },
    },
    '& > button': {
      marginTop: '15px',
      padding: '3px 12px',
      border: '1px solid white',
      borderRadius: '3px',
      color: '#8380ff',
      backgroundColor: 'white',
      marginRight: '40px',
      marginLeft: 'auto',
    },
  },
  checkboxLabel: {
    display: 'flex',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: 'calc(50% + 44px)',
    left: 'calc(50% + 40px)',
    fontSize: 20,
    '& input': {
      flex: '0 0 20px',
      height: 20,
    },
  },
  includeThoughts: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: '100px 10vw',
    [theme.breakpoints.up('sm')]: {
      margin: 50,
    },
    overflow: 'hidden',
    marginTop: 0,
    backgroundColor: theme.palette.gray[100],
    ...theme.defaults.castShadow.light,
  },
  includeThoughtsColumnHeaders: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 15,
    '& > span': {
      fontWeight: 600,
    }
  },
  selectableThoughts: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    margin: '0 15px',
    overflow: 'auto',
  },
  selectableThought: {
    textAlign: 'left',
    transition: 'all 0.2s linear',
    marginBottom: 15,
    '&.selected': {
      textAlign: 'right',
    }
  },
  selectableThoughtTitle: {

  },
  errorText: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    textAlign: 'center',
    marginBottom: '15px',
    color: theme.palette.red[500],
  },
  cancelButton: {
    padding: '10px 0',
    backgroundColor: theme.palette.red[300],
    color: 'white',
  },
  circleButton: {
    ...theme.defaults.circleButton,
    border: `2px solid ${theme.palette.gray[200]}`,
    backgroundColor: theme.palette.gray[600],
    opacity: 0.5,
    transition: 'all 0.1s linear',
    '&#return-home': {
      right: 10,
      top: 10,
    },
    '&#cancel': {
      left: 10,
      bottom: 10,
    },
    '&#submit': {
      right: 10,
      bottom: 10,
    },
    '&#without-thoughts': {
      bottom: 10,
      left: 'calc(50% - 65px)',
      border: `2px solid ${theme.palette.primary[500]}`,
    },
    '&:not([disabled])': {
      opacity: 1,
      border: `2px solid ${theme.palette.primary[500]}`,
      '&:hover': {
        transform: 'scale(1.1)',
        ...theme.defaults.castShadow.heavy,
      },
      '&:active': {
        transform: 'scale(1)',
        boxShadow: 'none',
      },
    },
  },
});