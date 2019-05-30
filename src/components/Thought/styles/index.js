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
    }
  },
  thoughtInformation: {
    display: 'grid',
    position: 'relative',
    gridGap: '10px',
    padding: 10,
    gridTemplateAreas: `"title title title"
                        "time status change-status-button"
                        "date type type"
                        "notes notes notes"
                        "tags tags tags"
                        "description description description"`,
    gridTemplateRows: 'max-content',
    gridTemplateColumns: 'max-content 1fr max-content',
  },
  thoughtTitle: {
    color: theme.palette.secondary[400],
    fontSize: 30,
    gridArea: 'title',
  },
  thoughtTime: {
    color: theme.palette.secondary[300],
    gridArea: 'time',
  },
  thoughtDate: {
    color: theme.palette.secondary[300],
    gridArea: 'date',
  },
  thoughtStatus: {
    color: theme.palette.secondary[300],
    gridArea: 'status',
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
      top: 'unset',
      bottom: 0,
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
