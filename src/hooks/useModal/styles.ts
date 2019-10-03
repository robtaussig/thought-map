import { StyleRules } from '@material-ui/styles';

export const styles = (theme: any): StyleRules => ({
  root: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#321587',
    padding: 30,
    color: theme.palette.gray[200],
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 5,
    color: '#ECECEC',
  },
  '& input': {
    fontSize: 20,
  },
});
