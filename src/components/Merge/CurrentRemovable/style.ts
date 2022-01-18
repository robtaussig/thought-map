import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: any) => ({
    root: {
        display: 'grid',
        gridTemplateAreas: `"removable right-header"
                        "removable delete-button"
                        "keep-button delete-button"`,
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'max-content 1fr max-content',
        gridGap: '10px',
        overflow: 'hidden',
    },
    removable: {
        gridArea: 'removable',
        overflow: 'auto',
    },
    rightHeader: (params: any) => ({
        gridArea: 'right-header',
        fontWeight: 600,
        textTransform: 'uppercase',
        color: theme.palette.negative[500],
        padding: 10,
        paddingBottom: 0,
        textAlign: 'right',
    }),
    deleteButton: (params: any) => ({
        gridArea: 'delete-button',
        color: theme.palette.negative[500],
        '& svg': {
            height: '5em',
            width: '5em',
        },
    }),
    keepButton: (params: any) => ({
        gridArea: 'keep-button',
        margin: 10,
        padding: '5px 15px',
        backgroundColor: theme.palette.primary[600],
        borderRadius: 5,
        color: 'white',
        fontWeight: 600,
        marginTop: 0,
        marginBottom: 15,
        boxShadow: '0px 0px 10px -5px black',
    }),
}));
