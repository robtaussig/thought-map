import { StyleRules } from '@material-ui/core/styles';

export const styles = (theme: any): StyleRules => ({
  root: {
    overflow: 'auto',
  },
  prioritiesButton: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    color: theme.palette.secondary[700],
    zIndex: 1,
    borderTop: '1px solid white',
    fontWeight: 600,
    cursor: 'pointer',
  },
  header: {
    marginBottom: 20,
    fontSize: 24,
    paddingRight: 15,
    marginRight: 15,
    color: theme.palette.secondary[700],
  },
  priorityList: {
    display: 'grid',
    gridTemplateColumns: '[title] 1fr [date] 80px [status] 80px',
    gridColumnGap: '5px',
    gridRowGap: '15px',
  },
  thoughtTitle: {
    '& > button': {
      color: theme.palette.secondary[700],
      fontWeight: 600,
    },
    '&.highPriority': {
      position: 'relative',
      '& > button': {
        color: theme.palette.red[400],
      }
    }
  },
  thoughtTitleButton: {
    textAlign: 'left',
  },
  fieldHeader: {
    fontWeight: 600,
  },
  thoughtDate: {

  },
  thoughtStatus: {

  },
});
