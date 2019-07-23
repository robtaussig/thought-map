export const styles = theme => ({
  root: {

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
    fontSize: 24,
    marginBottom: 20,
  },
  priorityList: {
    display: 'grid',
    gridTemplateColumns: '[title] 1fr [date] 80px [status] 80px',
    gridRowGap: '5px',
  },
  thoughtTitle: {

  },
  fieldHeader: {
    fontWeight: 600,
  },
  thoughtTitle: {

  },
  thoughtDate: {

  },
  thoughtStatus: {

  },
});
