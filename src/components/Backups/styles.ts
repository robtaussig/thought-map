import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: any) => ({
  root: () => ({
    display: 'grid',
    gridTemplateAreas: `"header header header"
                        "backups-list backups-list backups-list"
                        ". add-button ."`,
    gridTemplateColumns: '1fr max-content 1fr',
    gridTemplateRows: 'max-content 1fr 105px',
    overflow: 'hidden',
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.background[700],
  }),
  header: () => ({
    gridArea: 'header',
    fontWeight: 900,
    fontSize: 20,
    color: theme.palette.secondary[200],
    padding: 20,
  }),
  backupsList: () => ({
    gridArea: 'backups-list',
    overflow: 'auto',
  }),
  addButton: () => ({
    gridArea: 'add-button',
    color: theme.palette.background[200],
    '& svg': {
      height: '1.5em',
      width: '1.5em',
    },
  }),
  backup: () => ({
    backgroundColor: theme.palette.background[100],
    margin: 20,
    position: 'relative',
    padding: 10,
    borderRadius: '3px',
    marginTop: 0,
    display: 'grid',
    gridTemplateAreas: `"backup-id update-status update-status edit"
                        "private-key delete active active"
                        "merge pull push push"`,
    gridTemplateRows: 'max-content max-content max-content',
    gridTemplateColumns: 'repeat(3, minmax(max-content, 1fr)) 30px',
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
  backupId: () => ({
    gridArea: 'backup-id',
    color: theme.palette.primary[600],
    fontWeight: 600,
    ...theme.defaults.centered,
    marginRight: 'auto',
  }),
  editButton: () => ({
    gridArea: 'edit',
    color: theme.palette.negative[500],
    ...theme.defaults.centered,
    '& svg': {
      height: '0.75em',
      width: '0.75em',
    },
  }),
  updateStatus: () => ({
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
  version: () => ({
    ...theme.defaults.centered,
    '&.merged': {
      fontWeight: 600,
    },
  }),
  button: () => ({
    border: `1px solid ${theme.palette.secondary[700]}`,
    borderRadius: '3px',
    color: theme.palette.secondary[700],
    fontWeight: 600,
    padding: '0 5px',
    cursor: 'pointer',
    '&.privateKey': {
      gridArea: 'private-key',
    },
    '&.merge': {
      gridArea: 'merge',
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
