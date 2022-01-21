import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: any) => ({
  root: () => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: 20,
    backgroundColor: theme.palette.background[700],
    color: theme.palette.background[0],
  }),
  header: {    
    fontWeight: 600,
    fontSize: 20,
  },
  dailyChunks: {    
    overflow: 'auto',
  },
  dailyChunk: () => ({
    display: 'grid',
    gridTemplateColumns: '[status] max-content [thought] 1fr',
    gridAutoFlow: 'row',
    gridGap: '10px',
    backgroundColor: theme.palette.background[200],
    color: theme.palette.secondary[600],
    borderRadius: 5,
    padding: 20,
    boxShadow: 'inset 0px 0px 10px 1px black',
    '&:not(:last-child)': {
      marginBottom: 20,
    },
  }),
  date: {
    gridColumn: '1 / -1',
    fontWeight: 600,
    marginBottom: 20,
  },
  statusText: {
    gridColumn: 'status',
    fontWeight: 600,
    borderRadius: 5,
    padding: '0 5px',
    ...theme.defaults.centered,
  },
  thought: {
    gridColumn: 'thought',
    display: 'flex',
    flexDirection: 'column',
  },
  time: {
    fontWeight: 600,
  },
  title: {},
}));
