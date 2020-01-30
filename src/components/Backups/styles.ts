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
    position: 'relative',
    padding: 10,
    borderRadius: '3px',
    marginTop: 0,
    display: 'grid',
    gridTemplateAreas: `"backup-id update-status update-status"
                        "private-key private-key active"
                        "delete pull push"`,
    gridTemplateRows: 'max-content max-content max-content',
    gridTemplateColumns: 'repeat(3, minmax(max-content, 1fr))',
    gridRowGap: '10px',
    gridColumnGap: '5px',
    '&.isUpdating': {
      '&:after': {
        content: '"Updating..."',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#808080c9',
        zIndex: 999999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.secondary[300],
        textShadow: '1px 1px 4px #000000',
        fontWeight: 600,
        fontSize: 20,
      },
    },
  }),
  backupId: (params: any) => ({
    gridArea: 'backup-id',
    color: theme.palette.primary[600],
    fontWeight: 600,
  }),
  updateStatus: (params: any) => ({
    gridArea: 'update-status',        
    fontStyle: 'italic',
    display: 'flex',
    justifyContent: 'space-around',
    color: theme.palette.secondary[600],
    '&.updateAvailable': {
      color: theme.palette.primary[600],
      fontWeight: 600,
    },
  }),
  version: (params: any) => ({

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
    '&:disabled': {
      color: 'gray',
    },
  }),
}));
