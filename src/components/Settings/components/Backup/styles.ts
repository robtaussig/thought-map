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
      flexDirection: 'column-reverse',
      textTransform: 'uppercase',
      flex: 1,
    },
  },
  idForm: {
    display: 'flex',
  },  
  uploadButton: () => ({
    flex: 0,
    marginLeft: 30,
    color: theme.palette.primary[700],
    fontWeight: 600,
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
}));
