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
  headerContainer: {
    marginBottom: 20,
    display: 'flex',
  },
  header: {
    fontSize: 24,
    borderRight: '1px solid black',
    paddingRight: 15,
    marginRight: 15,
  },
  priorityList: {
    display: 'grid',
    gridTemplateColumns: '[title] 1fr [date] 80px [status] 80px',
    gridGap: '5px',
  },
  createThoughtButton: {
    borderRadius: '3px',
    border: '1px solid white',
    padding: '3px 8px',
    color: 'white',
    userSelect: 'none',
  },
  thoughtTitle: {
    '&.highPriority': {
      position: 'relative',
      fontWeight: 600,
      '& > button': {
        color: '#b12121!important',
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
