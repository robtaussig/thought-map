export const styles = theme => ({
  root: {
    position: 'fixed',
    height: '100vh',
    left: 0,
    right: 0,
    backgroundColor: '#545454f0',    
    transition: 'all 0.3s linear',
  },
  settings: {
    height: '100%',
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '& > button:not(#delete-thought)': {
      width: 200,
      margin: 20,
      padding: '10px 20px',
      borderRadius: 5,
      backgroundColor: theme.palette.primary[500],
    },
  },
  templateButton: {

  },
  templateSettings: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  form: {
    display: 'flex',
    '& *': {
      display: 'flex',
      width: '100%',
    },
    '& span': {
      display: 'none',
    }
  },
  input: {

  },
  submitButton: {
    marginLeft: 'auto',
    border: '1px solid white',
    padding: '3px 10px',
    color: 'white',
    width: 'unset',
  },
  color: {

  },
  background: {

  },
  fields: {

  },
  recurring: {

  },
  circleButton: {
    ...theme.defaults.circleButton,
    '&#delete-thought': {
      bottom: 10,
      right: 10,
      border: `2px solid ${theme.palette.red[300]}`,
      backgroundColor: theme.palette.red[300],
    },
  },
});
