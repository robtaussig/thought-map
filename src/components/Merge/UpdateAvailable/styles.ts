import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles((theme: any) => ({
    root: {
        display: 'grid',
        gridGap: '5px',
        gridTemplateAreas: `"header header header"
                        "backup-id backup-id backup-id"
                        "current-field current-value ."
                        "latest-field latest-value ."
                        "merge-button merge-button merge-button"`,
        gridTemplateColumns: 'max-content max-content 1fr',
        gridTemplateRows: 'max-content max-content max-content 1fr',
    },
    header: {
        gridArea: 'header',
        fontSize: 20,
    },
    backupId: {
        gridArea: 'backup-id',
        fontSize: 20,
        fontWeight: 600,
        marginBottom: 20,
    },
    buttonWrapper: (params: any) => ({
        gridArea: 'merge-button',
        marginTop: 25,
        color: 'white',
        position: 'relative',
        display: 'flex',
        '& .tooltip': {
            '& svg': {
                color: theme.palette.secondary[600],
            },
        },
    }),
    mergeButton: (params: any) => ({
        ...theme.defaults.centered,
        backgroundColor: theme.palette.secondary[600],
        color: 'white',
        flex: 1,
        padding: '15px 10px',
        borderRadius: 5,
        fontWeight: 600,
    }),
    field: {
        '&.current': {
            gridArea: 'current-field',
        },
        '&.latest': {
            gridArea: 'latest-field',
        },
    },
    value: {
        fontWeight: 600,
        '&.current': {
            gridArea: 'current-value',
        },
        '&.latest': {
            gridArea: 'latest-value',
        },
    },
}));
