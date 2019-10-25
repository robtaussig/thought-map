import { StyleRules } from '@material-ui/styles';

export const styles = (theme: any): StyleRules => ({
  root: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.palette.secondary[700],
    padding: 30,
    backgroundColor: theme.palette.gray[200],
    borderRadius: '10px',
    userSelect: 'none',
    '&:focus': {
      outline: 'none',
    },
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 5,
    color: theme.palette.secondary[700],
  },
});
