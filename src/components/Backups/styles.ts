import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: any) => ({
  root: (params: any) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.background[700],
  }),
  header: (params: any) => ({
    fontWeight: 900,
    fontSize: 20,
    color: theme.palette.secondary[200],
    padding: 20,
  }),
  backup: (params: any) => ({
    backgroundColor: theme.palette.background[100],
    margin: 20,
    padding: 10,
    borderRadius: '3px',
    marginTop: 0,
    display: 'grid',
    gridTemplateAreas: `"backup-id sync-date sync-date"
                        "private-key private-key active"
                        "delete pull push"`,
    gridTemplateRows: 'max-content max-content max-content',
    gridTemplateColumns: 'repeat(3, minmax(max-content, 1fr))',
    gridRowGap: '10px',
    gridColumnGap: '5px',
  }),
  backupId: (params: any) => ({
    gridArea: 'backup-id',
    color: theme.palette.primary[600],
    fontWeight: 600,
  }),
  syncDate: (params: any) => ({
    gridArea: 'sync-date',
    textAlign: 'right',
    color: theme.palette.primary[400],
    fontStyle: 'italic',
    '&.updateAvailable': {

    },
  }),
  button: (params: any) => ({
    border: `1px solid ${theme.palette.secondary[700]}`,
    borderRadius: '3px',
    color: theme.palette.secondary[700],
    fontWeight: 600,
    padding: '0 5px',
    cursor: 'pointer',
    '&.privateKey': {
      gridArea: 'private-key',
    },
    '&.pull': {
      gridArea: 'pull',
    },
    '&.push': {
      gridArea: 'push',
    },
    '&.delete': {
      gridArea: 'delete',
    },
    '&.active': {
      gridArea: 'active',
      '&.isActive': {
        fontWeight: 600,
        color: theme.palette.background[100],
        backgroundColor: theme.palette.secondary[700],
      },
    },
  }),
}));
