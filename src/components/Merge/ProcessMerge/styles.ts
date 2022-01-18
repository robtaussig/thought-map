import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: any) => ({
  root: () => ({
    height: '100%',
    width: '100%',
    ...theme.defaults.centered,
    backgroundColor: theme.palette.secondary[700],
  }),
  mergeButton: {
    backgroundColor: theme.palette.secondary[400],
    ...theme.defaults.castShadow.heavy,
    borderRadius: '50%',
    color: 'white',
    fontSize: 24,
    fontWeight: 600,
    height: 200,
    width: 200,
  },
}));