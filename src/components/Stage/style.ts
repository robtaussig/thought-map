import { StyleRules } from '@material-ui/styles';

export const styles = (theme: any): StyleRules => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: theme.palette.gray[700],
    '& #staging-nav': {
      flex: '0 0 80px',
    },
  },
  stagingItems: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'auto',
  },
  stagedItem: {
    display: 'flex',
    minHeight: 20,
    margin: 10,
    alignItems: 'center',
    backgroundColor: theme.palette.gray[200],
    borderRadius: '5px',
    '&:not(:last-child)': {
      marginBottom: 0,
    },
    '& button': {
      height: '100%',
      ...theme.defaults.centered,
    },
  },
  stagedItemTitle: {
    flex: 1,
    margin: 10,
    color: theme.palette.gray[600],
  },
  unstageButton: {
    flex: '0 0 50px',
    color: theme.palette.red[300],
  },
  promoteButton: {
    flex: '0 0 50px',
    '&:not(:disabled)': {
      color: theme.palette.secondary[500],
    },
  },
});
