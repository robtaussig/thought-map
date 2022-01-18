import { makeStyles } from '@material-ui/styles';

export const useCustomObjectStyles = makeStyles((theme: any) => ({
  container: (params: any) => ({
    position: 'fixed',
    height: '100%',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: theme.useDarkMode ? '#2f2f2f' : theme.palette.background[500],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.2s ease-out',
    zIndex: 100,
    '&.hidden': {
      '& #submit': {
        display: 'none',
      }
    }
  }),
  header: (params: any) => ({
    flex: '0 0 80px',
    backgroundColor: theme.palette.primary[500],
    boxShadow: '0px 0px 5px 0px black',
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontSize: 24,
  }),
  button: (params: any) => ({
    border: `2px solid ${theme.palette.secondary[0]}`,
    padding: '3px 0',
    marginTop: 40,
    width: '70%',
    borderRadius: '3px',
    backgroundColor: theme.palette.secondary[500],
    color: theme.palette.background[0],
    '&:active': {
      backgroundColor: theme.palette.background[700],
      boxShadow: 'none!important',
    },
    '&:disabled': {
      backgroundColor: theme.palette.background[300],
      color: theme.palette.background[0],
    },
    '&:not(:disabled)': {
      boxShadow: '0px 0px 5px 2px black',
    },
  }),
  circleButton: (params: any) => ({
    ...theme.defaults.circleButton,
    backgroundColor: theme.useDarkMode ? 'black' : theme.palette.background[600],
    '&#submit': {
      right: 10,
      bottom: 10,
    },
  }),
}));

export const useBaseCustomObjectStyles = makeStyles((theme: any) => ({
  root: {
    display: 'grid',
    gridTemplateAreas: `"header . ."
                        "form form form"
                        "items items items"`,
    gridTemplateColumns: 'max-content 1fr max-content',
    gridTemplateRows: 'max-content max-content 1fr',
    gridGap: '5px',
    overflow: 'hidden',
    maxHeight: '50vh',
  },
  header: (params: any) => ({
    fontWeight: 600,
    color: theme.palette.secondary[700],
    gridArea: 'header',
    textTransform: 'capitalize',
  }),
  form: (params: any) => ({
    gridArea: 'form',
    display: 'flex',
    '& button': {
      fontWeight: 600,
      cursor: 'pointer',
      marginLeft: 30,
      color: theme.palette.secondary[700],
    },
  }),
  inputLabel: {
    flex: 1,
    '& input': {
      width: '100%',
    },
  },
  createButton: (params: any) => ({

  }),
  customObjects: (params: any) => ({
    gridArea: 'items',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  }),
  customObject: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deleteCustomObject: (params: any) => ({
    color: theme.palette.negative[500],
  }),
}));

export const useDeleteTemplateStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  template: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  templateText: () => ({
    fontWeight: 600,
    color: theme.palette.secondary[700],
  }),
  deleteTemplate: () => ({
    color: theme.palette.negative[500],
  }),
}));
