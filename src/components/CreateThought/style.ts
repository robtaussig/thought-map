import { StyleRules, makeStyles } from '@material-ui/core/styles';

export const styles = (theme: any): StyleRules => ({
    form: {
        height: '100%',
        display: 'grid',
        gridTemplateAreas: `"title title"
                        "type type"
                        "plan plan"
                        "bulk submit"`,
        gridTemplateRows: 'max-content max-content max-content max-content',
        gridTemplateColumns: 'max-content 1fr',
        gridGap: '10px',
    },
    expanded: {
        gridTemplateAreas: `"title title"
                        "type ."
                        "expanded expanded"
                        ". submit"`,
        gridTemplateRows: 'max-content max-content 1fr max-content',
        gridTemplateColumns: '1fr max-content',
    },
    expandedContent: {
        gridArea: 'expanded',
    },
    inputLabel: {
        '&#title': {
            gridArea: 'title',
            '& input': {
                width: '100%',
                fontSize: 18,
            },
        },
    },
    selectLabel: {
        '&#type': {
            gridArea: 'type',
            '& select': {
                width: '100%',
                fontSize: 18,
            },
        },
        '&#plan': {
            gridArea: 'plan',
            '& select': {
                width: '100%',
                fontSize: 18,
            },
        },
    },
    bulkButton: () => ({
        gridArea: 'bulk',
        cursor: 'pointer',
        fontWeight: 600,
        color: theme.palette.secondary[700],
        marginTop: 20,
        border: `1px solid ${theme.palette.secondary[700]}`,
        padding: '5px 12px',
        borderRadius: '5px',
        '&:disabled': {
            color: 'gray',
            border: '1px solid gray',
        },
    }),
    submitButton: () => ({
        gridArea: 'submit',
        cursor: 'pointer',
        fontWeight: 600,
        color: theme.palette.secondary[700],
        marginTop: 20,
        border: `1px solid ${theme.palette.secondary[700]}`,
        padding: '5px 12px',
        borderRadius: '5px',
        '&:disabled': {
            color: 'gray',
            border: '1px solid gray',
        },
    }),
});

export const useBulkStyles = makeStyles((theme: any) => ({
    root: {
        display: 'grid',
        width: '100%',
        height: 300,
        gridGap: '15px',
        gridTemplateAreas: `"header header"
                        "input input"
                        "bulk-list-options bulk-list-options"
                        "save-button submit-button"`,
        gridTemplateColumns: '1fr max-content',
        gridTemplateRows: 'max-content 1fr max-content max-content',
    },
    header: {
        fontWeight: 600,
        color: theme.palette.secondary[600],
    },
    form: {
        gridArea: 'input',
    },
    textAreaLabel: {
        '& textarea': {
            height: '100%',
            width: '100%',
        },
    },
    savedListInput: {
        gridArea: 'bulk-list-options',
    },
    bulkListOptions: {
        gridArea: 'bulk-list-options',
    },
    saveButton: {
        gridArea: 'save-button',
        cursor: 'pointer',
        fontWeight: 600,
        color: theme.palette.secondary[700],
        border: `1px solid ${theme.palette.secondary[700]}`,
        padding: '5px 12px',
        borderRadius: '5px',
        '&:disabled': {
            color: 'gray',
            border: '1px solid gray',
        },
    },
    submitButton: {
        gridArea: 'submit-button',
        cursor: 'pointer',
        fontWeight: 600,
        color: theme.palette.secondary[700],
        border: `1px solid ${theme.palette.secondary[700]}`,
        padding: '5px 12px',
        borderRadius: '5px',
        '&:disabled': {
            color: 'gray',
            border: '1px solid gray',
        },
    },
}));