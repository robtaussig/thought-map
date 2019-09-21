import { StyleRules } from '@material-ui/core/styles';

export const styles = (theme: any): StyleRules => ({
  root: {
    height: '100%',
    position: 'relative',
    overflow: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
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
    '& #thought-title': {
      gridArea: 'title',
      '& input': {
        fontSize: 24,
        width: '100%',
      },
    },
    '& #description': {
      gridArea: 'description',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
    },
  },
  thoughtInformation: {
    display: 'grid',
    position: 'relative',
    gridColumnGap: '10px',
    gridRowGap: '30px',
    padding: 10,
    gridTemplateAreas: `"title title ."
                        "create-time create-time create-time"
                        "time date ."
                        "type status complete-button"
                        "priority priority priority-button"
                        "notes notes notes"
                        "tags tags tags"
                        "description description description"
                        "pinned-pictures pinned-pictures pinned-pictures"`,
    gridTemplateRows: 'max-content',
    gridTemplateColumns: 'max-content 1fr 50px',
  },
  completeButton: {
    gridArea: 'complete-button',
    cursor: 'pointer',
    ...theme.defaults.centered,
  },
  priorityButton: {
    gridArea: 'priority-button',
    cursor: 'pointer',
    ...theme.defaults.centered,
  },
  priorityHeader: {
    gridArea: 'priority-header',
    color: theme.palette.secondary[300],
    ...theme.defaults.centered,
    fontSize: 20,
  },
  priorityText: {
    gridArea: 'priority',
    color: theme.palette.secondary[300],
    ...theme.defaults.centered,
    fontSize: 20,
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
    '&#priority': {
      gridArea: 'priority',
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
  statusText: {
    gridArea: 'status',
    color: theme.palette.secondary[300],
    ...theme.defaults.centered,
    fontSize: 20,
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
    '& #added-tag': {
      margin: '10px 0',
      marginRight: 10,
      color: theme.palette.secondary[300],
      border: `1px solid ${theme.palette.secondary[300]}`,
      padding: '4px 10px',
      borderRadius: '10px',
    },
  },
  tagItem: {
    margin: '10px 0',
    marginRight: 10,
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.secondary[300],
    border: `1px solid ${theme.palette.secondary[300]}`,
    padding: '4px 10px',
    borderRadius: '10px',
  },
  deleteTagIcon: {
    color: theme.palette.red[500],
  },
  deleteTagButton: {
    ...theme.defaults.centered,
  },
  thoughtDescription: {
    gridArea: 'description',
    color: theme.palette.secondary[300],
  },
  circleButton: {
    ...theme.defaults.circleButton,
    border: `2px solid ${theme.palette.primary[500]}`,
    backgroundColor: theme.palette.gray[600],
    opacity: 0.5,
    '&#return-home': {
      top: 10,
      right: 10,
    },
    '&#settings': {
      bottom: 10,
      left: 10,
      '& svg': {
        willChange: 'transform',
        transition: 'transform 0.3s linear',
        transform: 'rotate(-90deg)',
        '&.gear-opening': {
          transform: 'rotate(90deg) scale(2)',
        },
      },
    },
    '&#edit': {
      bottom: 10,
      right: 10,
      border: `2px solid ${theme.palette.primary[500]}`,
    },
    '&#from': {
      bottom: 10,
      left: 10,
      border: `2px solid ${theme.palette.primary[500]}`,
    },
    '&#to': {
      bottom: 10,
      left: 'calc(50% - 65px)',
      border: `2px solid ${theme.palette.primary[500]}`,
    },
  },
  addItem: {
    border: `1px solid ${theme.palette.primary[500]}`,
    color: theme.palette.primary[500],
    borderRadius: '5px',
    padding: '3px 5px',
    willChange: 'transform',
    transition: 'transform 0.1s linear',
    '&:active': {
      transform: 'scale(0.96)',
    },
  },
  noteEditInput: {

  },
  creationTimes: {
    gridArea: 'create-time',
    display: 'flex',
  },
  timeText: {
    marginRight: 20,
    color: 'white',
  },
  pinnedPictures: {
    gridArea: 'pinned-pictures',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: 'auto',
    flex: 1,
  },
});
