import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: any) => ({
  root: (params: any) => ({
    display: 'grid',
    gridTemplateAreas: `"qr-code qr-code"
                        "copy-button reveal-button"
                        "private-key private-key"`,
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'max-content max-content 1fr',
    gridGap: '5px',
    '& button': {
      cursor: 'pointer',
    },
  }),
  header: (params: any) => ({
    gridArea: 'header',
    fontWeight: 600,
    fontSize: 20,
  }),
  canvas: (params: any) => ({
    gridArea: 'qr-code',
    margin: '0 auto',
    marginBottom: 30,
  }),
  copyButton: (params: any) => ({
    gridArea: 'copy-button',
    color: theme.palette.secondary[600],
    border: `1px solid ${theme.palette.secondary[600]}`,
    borderRadius: '3px',
    padding: '3px 12px',
  }),
  revealTextButton: (params: any) => ({
    gridArea: 'reveal-button',
    color: theme.palette.negative[500],
    border: `1px solid ${theme.palette.negative[600]}`,
    borderRadius: '3px',
    padding: '3px 12px',
  }),
  privateKeyText: (params: any) => ({
    gridArea: 'private-key',
    overflow: 'auto',
    userSelect: 'all',
  }),
}));
