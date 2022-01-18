import { makeStyles, StyleRules } from '@material-ui/styles';

const styles = (theme: any): StyleRules => ({
    container: () => ({
        position: 'fixed',
        height: '100%',
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: theme.useDarkMode ? '#2f2f2f' : theme.palette.background[500],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'all 0.2s ease-out',
        zIndex: 100,
        '&.hidden': {
            '& #submit': {
                display: 'none',
            }
        }
    }),
    header: () => ({
        flex: '0 0 80px',
        backgroundColor: theme.palette.primary[500],
        boxShadow: '0px 0px 5px 0px black',
        width: '100%',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        fontSize: 24,
    }),
    button: () => ({
        border: `2px solid ${theme.palette.secondary[0]}`,
        padding: '3px 0',
        marginTop: 40,
        width: '70%',
        borderRadius: '3px',
        backgroundColor: theme.palette.secondary[500],
        color: theme.palette.background[0],
        '&:active': {
            backgroundColor: theme.palette.background[700],
            boxShadow: 'none!important',
        },
        '&:disabled': {
            backgroundColor: theme.palette.background[300],
            color: theme.palette.background[0],
        },
        '&:not(:disabled)': {
            boxShadow: '0px 0px 5px 2px black',
        }
    }),
    buttonWrapper: () => ({
        border: `2px solid ${theme.palette.secondary[0]}`,
        marginTop: 40,
        width: '70%',
        borderRadius: '3px',
        backgroundColor: theme.palette.secondary[500],
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        boxShadow: '0px 0px 5px 2px black',
        '& .tooltip': {
            position: 'absolute',
            justifyContent: 'center',
            right: -30,
        }
    }),
    tooltipButton: () => ({
        color: theme.palette.background[0],
        padding: '3px 0',
        flex: 1,
        '&:active': {
            backgroundColor: theme.palette.background[700],
            boxShadow: 'none!important',
        },
        '&:disabled': {
            backgroundColor: theme.palette.background[300],
            color: theme.palette.background[0],
        },
    }),
    uploadInput: () => ({
        display: 'flex',
        justifyContent: 'center',
        border: `2px solid ${theme.palette.secondary[0]}`,
        padding: '3px 0',
        marginTop: 40,
        width: '70%',
        borderRadius: '3px',
        backgroundColor: theme.palette.secondary[500],
        color: theme.palette.background[0],
        boxShadow: '0px 0px 5px 2px black',
        '& > input': {
            display: 'none',
        }
    }),
    circleButton: () => ({
        ...theme.defaults.circleButton,
        backgroundColor: theme.useDarkMode ? 'black' : theme.palette.background[600],
        '&#submit': {
            right: 10,
            bottom: 10,
        },
    }),
    checkboxLabel: () => ({
        marginTop: 40,
        width: '70%',
        padding: '3px 0',
        display: 'flex',
        alignItems: 'center',
        height: 30,
        color: theme.palette.background[0],
        '& > input': {
            marginRight: 5,
        }
    }),
});

export const useStyles = makeStyles(styles);
