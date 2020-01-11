import { StyleRules } from '@material-ui/core/styles';

export const rootStyles = (theme: any): StyleRules => ({
  root: () => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.palette.background[700],
  }),
});

export const planSettingsStyles = (theme: any): StyleRules => ({
  root: {
    flex: 1,
    display: 'grid',
    paddingBottom: '80px',
    margin: 20,
    gridTemplateAreas: `"plan-name plan-name plan-name"
                        "group-thoughts archive-plan show-completed"
                        "add-thoughts add-thoughts add-thoughts"
                        "remove-thoughts remove-thoughts remove-thoughts"
                        "default-type default-type default-type"
                        "delete-plan delete-plan delete-plan"`,
    gridTemplateRows: '50px 50px 50px 50px 50px 1fr',
    gridTemplateColumns: 'max-content 1fr',
    gridRowGap: '20px',
    gridColumnGap: '10px',
    overflow: 'auto',
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  inputLabel: () => ({
    '&#plan-name': {
      gridArea: 'plan-name',
      display: 'flex',
      position: 'relative',
      '& > *': {
        flex: 1,
      },
      '& input': {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        color: theme.palette.primary[500],
        fontSize: 24,
        border: 'none',
        borderBottom: `1px solid ${theme.palette.primary[500]}`,
      },
    },
    '&#confirm-delete-plan': {
      display: 'flex',
      flexDirection: 'column-reverse',
      color: theme.palette.background[200],
      flex: 1,
    },
  }),
  selectLabel: () => ({
    display: 'flex',
    border: `1px solid ${theme.palette.primary[500]}`,
    backgroundColor: theme.palette.background[200],
    '& > select': {
      height: '100%',
      width: '100%',
      fontSize: 18,
    },
    '&#add-thoughts': {
      gridArea: 'add-thoughts',
    },
    '&#remove-thoughts': {
      gridArea: 'remove-thoughts',
    },
    '&#default-type': {
      flex: 1,
      height: '100%',
    },
  }),
  defaultType: {
    gridArea: 'default-type',
    display: 'flex',
    alignItems: 'center',
  },
  defaultTypeHeader: {
    color: 'white',
    fontWeight: 600,
    marginRight: 15,
  },
  checkboxLabel: () => ({
    ...theme.defaults.centered,
    justifyContent: 'flex-start',
    color: theme.palette.background[300],
    '&#show-completed': {
      gridArea: 'show-completed',
    },
    '&#group-thoughts': {
      gridArea: 'group-thoughts',
    },
    '&#archive-plan': {
      gridArea: 'archive-plan',
    },
    '&#with-thoughts': {
      marginLeft: 20,
    },
  }),
  deletePlanSection: () => ({
    gridArea: 'delete-plan',
    borderTop: `1px solid ${theme.palette.secondary[500]}`,
    display: 'flex',
    alignItems: 'center',
  }),
  deletePlanButton: () => ({
    marginRight: 20,
    backgroundColor: theme.palette.red[500],
    color: 'white',
    borderRadius: '4px',
    padding: '15px 30px',
    '&:disabled': {
      backgroundColor: theme.palette.background[300],
    },
  }),
  circleButton: {
    ...theme.defaults.circleButton,
    '&[disabled]': {
      opacity: 0.5,
    },
    '&#return-home': {
      bottom: 10,
      left: 10,
    },
    '&#submit-changes': {
      bottom: 10,
      right: 10,
    },
  },
});
