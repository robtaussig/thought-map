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
    '& #hide-from-home-screen': {
      width: 200,
      margin: 20,
      padding: '10px 20px',
      borderRadius: 5,
      backgroundColor: theme.palette.secondary[800],
      color: theme.palette.background[100],
      ...theme.defaults.centered,
      justifyContent: 'space-between',
      '& > input': {
        ...theme.defaults.centered,
        marginRight: 15,
        marginTop: 2,
      },
    },
  },
  templateSettings: {
    
  },
  applySectionState: {
    position: 'relative',
    '& svg': {
      position: 'absolute',
      right: -13,
      top: 33,
    }
  },
  sectionStateButton: {
    width: 200,
    margin: 20,
    padding: '10px 20px',
    borderRadius: 5,
    backgroundColor: theme.palette.primary[500],
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
    border: `1px solid ${theme.palette.secondary[700]}`,
    padding: '3px 10px',
    color: theme.palette.secondary[700],
    width: 'unset',
  },
  color: {

  },
  recurring: {

  },
});
