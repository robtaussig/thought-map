export const styles = theme => ({
  root: {
    height: '100%',
    position: 'relative',
    backgroundColor: theme.palette.gray[700],
    '& #thought-loader': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    '& .icon-button': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.primary[600],
      border: `1px solid ${theme.palette.primary[500]}`,
      backgroundColor: theme.palette.primary[0],
      borderRadius: '3px',
    },
  },
  thoughtInformation: {
    display: 'grid',
    position: 'relative',
    gridGap: '10px',
    padding: 10,
    gridTemplateAreas: `"title title ."
                        "time date ."
                        "status status ."
                        "type . ."
                        "notes notes notes"
                        "tags tags tags"
                        "description description description"`,
    gridTemplateRows: 'max-content',
    gridTemplateColumns: 'max-content 1fr max-content',
  },
  header: {
    color: theme.palette.secondary[300],
    fontSize: 30,
    gridArea: 'title',
  },
  thoughtTime: {
    color: theme.palette.secondary[300],
    gridArea: 'time',
  },
  timeIcon: {

  },
  dateIcon: {

  },
  thoughtDate: {
    color: theme.palette.secondary[300],
    gridArea: 'date',
  },
  selectLabel: {
    color: theme.palette.primary[500],
    gridArea: 'status',
    border: `1px solid ${theme.palette.secondary[500]}`,
    backgroundColor: theme.palette.secondary[100],
    display: 'flex',
  },
  selectInput: {
    color: theme.palette.secondary[900],
    width: '100%',
    fontSize: 24,
  },
  changeStatus: {
    color: theme.palette.primary[500],
    gridArea: 'change-status-button',
  },
  thoughtType: {
    color: theme.palette.secondary[300],
    gridArea: 'type',
  },
  noteList: {
    gridArea: 'notes',
  },
  noteItem: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.secondary[300],
  },
  noteIcon: {
    marginRight: 5,
  },
  tagList: {
    gridArea: 'tags',
    display: 'flex',
  },
  tagItem: {
    margin: '0 10px',
    color: theme.palette.secondary[300],
  },
  thoughtDescription: {
    gridArea: 'description',
    color: theme.palette.secondary[300],
  },
  addButton: {
    position: 'fixed',
    border: `2px solid ${theme.palette.primary[500]}`,
    top: 0,
    right: 0,
    margin: 30,
    height: 70,
    width: 70,
    borderRadius: '50%',
    backgroundColor: theme.palette.gray[600],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
    transition: 'all 0.2s linear',
    color: 'white',
    '&:hover': {
      transform: 'scale(1.1)',
      ...theme.defaults.castShadow.heavy,
    },
    '&:active': {
      transform: 'scale(1)',
      boxShadow: 'none',
    },
    /**
     * Small
     */
    [theme.breakpoints.down('sm')]: {
      transition: 'all 0.1s linear',
      ...theme.defaults.castShadow.heavy,
      '&:hover': {
        transform: 'unset',
      },
      '&.touched': {
        boxShadow: 'none!important',
        transform: 'scale(0.9)!important',
      },
    },
  },
});
