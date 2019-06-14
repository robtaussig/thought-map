export const styles = theme => ({
  root: {
    height: '100%',
    position: 'relative',
    overflow: 'auto',
    overflowX: 'hidden',
    backgroundColor: theme.palette.gray[700],
    '& #thought-loader': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    '& .icon-button': {
      ...theme.defaults.centered,      
      color: theme.palette.primary[500],
      borderRadius: '3px',
      '&#time-button': {
        gridArea: 'time',
      },
      '&#date-button': {
        gridArea: 'date',
      },
    },
    '& #time': {
      gridArea: 'time',
      display: 'flex',
    },
    '& #date': {
      gridArea: 'date',
      display: 'flex',
      '& > input': {
        width: '100%',
      }
    },
  },
  thoughtInformation: {
    display: 'grid',
    position: 'relative',
    gridColumnGap: '10px',
    gridRowGap: '30px',
    padding: 10,
    gridTemplateAreas: `"title title ."
                        "time date ."
                        "type status status"
                        "notes notes notes"
                        "tags tags tags"
                        "description description description"`,
    gridTemplateRows: 'max-content',
    gridTemplateColumns: 'max-content 1fr max-content',
  },
  header: {
    color: theme.palette.secondary[300],
    borderBottom: `1px solid ${theme.palette.secondary[100]}`,
    fontSize: 30,
    gridArea: 'title',
  },
  thoughtTime: {
    color: theme.palette.secondary[300],
    gridArea: 'time',
    fontSize: 20,
  },
  timeIcon: {

  },
  dateIcon: {

  },
  thoughtDate: {
    color: theme.palette.secondary[300],
    gridArea: 'date',
    fontSize: 20,
  },
  selectLabel: {
    color: theme.palette.primary[500],    
    border: `1px solid ${theme.palette.primary[500]}`,
    backgroundColor: theme.palette.primary[100],
    display: 'flex',
    '&#status': {
      gridArea: 'status',
    },
    '&#type': {
      gridArea: 'type',
    },
  },
  selectInput: {
    color: theme.palette.primary[900],
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
    ...theme.defaults.centered,
    fontSize: 20,
  },
  noteList: {
    gridArea: 'notes',
  },
  noteItem: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.secondary[300],
    margin: '10px 0',
  },
  noteIcon: {
    marginRight: 5,
  },
  deleteIcon: {
    marginRight: 5,
    color: theme.palette.red[500],
    ...theme.defaults.centered,
    cursor: 'pointer',
  },
  tagList: {
    gridArea: 'tags',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  tagItem: {
    margin: '10px 5px',
    color: theme.palette.secondary[300],
    border: `1px solid ${theme.palette.secondary[300]}`,
    padding: '4px 10px',
    borderRadius: '10px',
  },
  thoughtDescription: {
    gridArea: 'description',
    color: theme.palette.secondary[300],
  },
  circleButton: {
    position: 'fixed',
    border: `2px solid ${theme.palette.primary[500]}`,
    '&#return-home': {
      top: 0,
      right: 0,
    },
    '&#delete': {
      bottom: 0,
      left: 0,
      border: `2px solid ${theme.palette.red[300]}`,
      backgroundColor: theme.palette.red[300],
    },
    '&#edit': {
      bottom: 0,
      right: 0,
      border: `2px solid ${theme.palette.primary[500]}`,
    },
    '&#from': {
      bottom: 0,
      left: 0,
      border: `2px solid ${theme.palette.primary[500]}`,
    },
    '&#to': {
      bottom: 0,
      left: 'calc(50% - 65px)',
      border: `2px solid ${theme.palette.primary[500]}`,
    },
    margin: 30,
    height: 70,
    width: 70,
    borderRadius: '50%',
    backgroundColor: theme.palette.gray[600],
    ...theme.defaults.centered,
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
  noteEditInput: {

  },
});
