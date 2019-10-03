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
    color: 'white',
    zIndex: 1,
    borderTop: '1px solid white',
    backgroundColor: 'dodgerblue',
    fontWeight: 600,
    cursor: 'pointer',
  },
  header: {
    marginBottom: 20,
    fontSize: 24,
    paddingRight: 15,
    marginRight: 15,
    color: theme.palette.gray[200],
  },
  priorityList: {
    display: 'grid',
    gridTemplateColumns: '[title] 1fr [date] 80px [status] 80px',
    gridGap: '5px',
  },
  thoughtTitle: {
    '& > button': {
      color: theme.palette.gray[200],
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
