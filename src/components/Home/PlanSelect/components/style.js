export const DEFAULT_STATE = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '10px',
  justifyContent: 'center',
};

export const styles = theme => ({
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
    marginBottom: 100,
    '& input': {
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '1px solid black',
      width: '80vw',
      fontSize: 24,
      padding: 5,
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
  cancelButton: {
    padding: '10px 0',
    backgroundColor: theme.palette.red[300],
    color: 'white',
  },
  circleButton: {
    position: 'fixed',
    border: `2px solid ${theme.palette.gray[200]}`,
    margin: 30,
    height: 70,
    width: 70,
    borderRadius: '50%',
    backgroundColor: theme.palette.gray[600],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s linear',
    color: 'white',
    opacity: 0.5,
    '&#cancel': {
      left: 0,
      bottom: 0,
    },
    '&#submit': {
      right: 0,
      bottom: 0,
    },
    '&#without-thoughts': {
      bottom: 0,
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
    /**
     * Small
     */
    [theme.breakpoints.down('sm')]: {
      top: 'unset',
      bottom: 0,
      transition: 'all 0.1s linear',
      '&#return-home': {
        left: 'unset',
        right: 0,
        top: 0,
        bottom: 'unset',
        display: 'block',
      },
      '&:not([disabled])': {
        ...theme.defaults.castShadow.heavy,
        '&:hover': {
          transform: 'unset',
        },
        '&.touched': {
          boxShadow: 'none!important',
          transform: 'scale(0.9)!important',
        },
      },
    },
  },
});