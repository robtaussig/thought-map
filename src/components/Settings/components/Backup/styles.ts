import { makeStyles } from '@material-ui/styles';
import { NAV_OPTIONS } from './constants';

export const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'grid',
    height: '100%',
    width: '100%',
    gridTemplateAreas: `"nav"
                        "body"`,
    gridTemplateRows: '30px 1fr',
    gridTemplateColumns: '1fr',
    gridRowGap: '20px',
  },
  nav: {
    gridArea: 'nav',
    display: 'grid',
    gridTemplateColumns: `repeat(${NAV_OPTIONS.length}, 1fr)`,
    transition: 'all 0.2s linear',
    '&.initial': {
      gridRow: '1 / -1',
      fontWeight: 900,
      fontSize: 20,
    },
  },
  navOption: () => ({
    color: theme.palette.secondary[500],
    '&.selected': {
      fontWeight: 600,
      borderBottom: `2px solid ${theme.palette.secondary[700]}`,
    },
  }),
  retrieve: {
    gridArea: 'body',
  },
  update: {
    gridArea: 'body',
  },
  upload: {
    gridArea: 'body',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  inputLabel: {
    '&#id-input': {
      display: 'flex',
      gridArea: 'id-input',
      flexDirection: 'column-reverse',
      textTransform: 'uppercase',
      flex: 1,
    },
    '&#password': {
      gridArea: 'password-input',
      display: 'flex',
      flexDirection: 'column-reverse',
      textTransform: 'uppercase',
      flex: 1,
    },
  },
  uploadForm: {
    display: 'grid',
    gridTemplateAreas: `"id-input submit-button"
                        "password-input submit-button"`,
    gridTemplateRows: 'max-content max-content',
    gridTemplateColumns: '1fr max-content',
  },  
  uploadButton: () => ({
    gridArea: 'submit-button',
    flex: 0,
    marginLeft: 30,
    color: theme.palette.primary[700],
    fontWeight: 600,
  }),
  uploadSuccess: () => ({
    flex: 0,
    gridArea: 'submit-button',
    ...theme.defaults.centered,
    marginLeft: 30,
    color: theme.palette.primary[700],
  }),
  copyToClipboardText: {
    marginTop: 10,
  },
  privateKey: {
    overflow: 'auto',
    padding: '10px 0',
    '&.copied': {
      color: 'limegreen',
    },
  },
  storeButton: () => ({
    marginTop: 20,
    color: theme.palette.primary[700],
    fontWeight: 600,
  }),
  textAreaLabel: {
    '&#private-key-textarea': {
      display: 'flex',
      flexDirection: 'column',
      margin: '10px 0px',
    },
  },
  useStoredButton: () => ({
    marginBottom: 10,
    color: theme.palette.secondary[500],
    fontWeight: 600,
  }),
  decryptionSuccess: () => ({
    color: theme.palette.primary[600],
  }),
  errorMessage: () => ({
    color: theme.palette.negative[600],
  }),
}));
