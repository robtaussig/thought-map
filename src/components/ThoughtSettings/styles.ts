import { StyleRules } from '@material-ui/core/styles';

export const styles = (theme: any): StyleRules => ({
  root: {
    position: 'fixed',
    height: '100%',
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
    
  },
  header: {
    fontSize: 20,
    gridArea: 'header',
  },
  form: {
    display: 'grid',
    gridTemplateAreas: `"header header"
                        "input input"
                        ". button"`,
    gridTemplateRows: 'max-content max-content max-content',
    gridTemplateColumns: '1fr max-content',
    gridRowGap: '30px',
    '& *': {
      display: 'flex',
      width: '100%',
    },
    '& span': {
      display: 'none',
    },
    '& #template-name': {
      gridArea: 'input',
      '& input': {
        fontSize: 20,
      },
    },
  },
  submitButton: {
    gridArea: 'button',
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
