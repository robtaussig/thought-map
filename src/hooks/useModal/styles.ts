import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: any) => ({
    root: (params: any) => ({
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        top: '50%',
        transform: 'translateY(-50%)',
        color: theme.palette.secondary[700],
        padding: 30,
        backgroundColor: theme.palette.background[0],
        borderRadius: '10px',
        userSelect: 'none',
        '&:focus': {
            outline: 'none',
        },
    }),
    closeButton: (params: any) => ({
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 5,
        color: theme.palette.secondary[700],
    }),
}));
