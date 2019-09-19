import { StyleRules } from '@material-ui/core/styles';

export const rootStyles = (theme: any): StyleRules => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.palette.gray[700],
  },
});

export const planSettingsStyles = (theme: any): StyleRules => ({
  root: {
    flex: 1,
    display: 'grid',
    paddingBottom: '80px',
    margin: 20,
    gridTemplateAreas: `"plan-name plan-name"
                        "show-completed show-completed"
                        "add-thoughts add-thoughts"
                        "remove-thoughts remove-thoughts"
                        "delete-plan delete-plan"`,
    gridTemplateRows: '50px 50px 50px 50px 1fr',
    gridTemplateColumns: 'max-content 1fr',
    gridRowGap: '20px',
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  inputLabel: {
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
  },
  selectLabel: {
    display: 'flex',
    border: `1px solid ${theme.palette.primary[500]}`,
    backgroundColor: theme.palette.gray[200],
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
  },
  checkboxLabel: {
    ...theme.defaults.centered,
    justifyContent: 'flex-start',
    color: theme.palette.gray[300],
    '&#show-completed': {
      gridArea: 'show-completed',
    },
    '&#with-thoughts': {
      
    },
  },
  deletePlanSection: {
    gridArea: 'delete-plan',
    borderTop: `1px solid ${theme.palette.secondary[500]}`,
    display: 'flex',
    alignItems: 'center',
  },
  deletePlanButton: {
    marginRight: 20,
    border: `1px solid ${theme.palette.red[500]}`,
    backgroundColor: theme.palette.red[500],
    color: 'white',
    borderRadius: '4px',
    padding: '15px 30px',
  },
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
