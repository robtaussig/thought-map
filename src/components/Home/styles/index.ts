import { StyleRules } from '@material-ui/core/styles';
import './styles.css';

export const styles = (theme: any): StyleRules => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'grid',
    padding: 20,
    backgroundColor: theme.palette.gray[700],
    gap: '20px',
    gridTemplateAreas: `"sort-buttons sort-buttons"
                        "content content"
                        "plans-list plans-list"
                        "search search"`,
    gridTemplateRows: '40px 7fr minmax(50px, 1fr) minmax(50px, 1fr)',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  selectLabel: {
    '&#plans': {
      gridArea: 'plans-list',
      display: 'flex',
      backgroundColor: theme.palette.primary[500],      
      borderRadius: '10px',
      position: 'relative',
      boxShadow: '0px 0px 5px -1px black',
      '& > select': {
        flex: 1,
        color: theme.palette.gray[600],
        display: 'flex',
        textAlignLast: 'center',
        paddingLeft: 13,
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: 24,
        fontWeight: 600,
      }
    },
  },
  content: {
    gridArea: 'content',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: 'white',
    overflow: 'auto',
    ...theme.defaults.castShadow.light,
    '& > h3': {
      fontWeight: 600,
    },
    '& > :not(:last-child)': {
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        borderBottom: '1px solid #0000003d',
        left: '20%',
        right: '20%',
        bottom: 0,
      },
    },
  },
  flippableWrapper: {
    display: 'flex',  
    gridArea: 'sort-buttons',
    position: 'relative',
  },
  sortByButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.primary[500],
    color: 'white',
  },
  searchWrapper: {
    backgroundColor: theme.palette.primary[500],
    color: 'white',
    display: 'flex',
    backfaceVisibility: 'hidden',
  },
  inputLabel: {
    flex: 1,
    height: '100%',
    display: 'flex',
    marginLeft: '10px',
    '& input': {
      width: '100%',
      margin: 'auto 0',
      fontSize: 18,
      borderRadius: '10px',
      border: '1px solid black',
      padding: '3px 10px',
      outline: 'none',
    }
  },
  searchButton: {
    flex: '0 0 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  sortButton: {
    color: theme.palette.gray[800],
    cursor: 'pointer',
    ...theme.defaults.centered,
    '&.selected': {
      fontWeight: 600,
    }
  },
  sortByNames: {    
    ...theme.defaults.centered,
    marginLeft: 24,
  },
  sortByStatus: {
    ...theme.defaults.centered,
    marginRight: 18,
    color: theme.palette.gray[800],
  },
  emptyIcon: {
    width: 24,
  },
  thoughtNode: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 10px',
    backgroundColor: 'white',
    userSelect: 'none',
    '& > #status-select': {
      marginLeft: 20,
      padding: '5px 0',
      backgroundColor: '#8380ff',      
      borderRadius: '10px',
      '& > select': {
        color: 'white',
        display: 'flex',
        textAlignLast: 'center',
        padding: '0 13px',
        backgroundColor: 'transparent',
        border: 'none',
      },
    },
  },
  connectionStatus: {
    marginLeft: 20,
    fontSize: 11,
    color: theme.palette.gray[300],
  },
  thoughtNodeTitleWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  planName: {
    fontSize: 10,
    fontWeight: 600,
    color: theme.palette.gray[300],
    '& > span': {
      marginLeft: 10,
    },
  },
  dateTime: {
    fontSize: 10,
    fontWeight: 600,
    color: theme.palette.secondary[600],
  },
  thoughtNodeTitle: {
    color: theme.palette.gray[500],
    flex: 1,
    '&.arrivedFrom': {
      fontWeight: 600,
      color: theme.palette.secondary[300],
    },
  },
  thoughtNodeType: {
    marginLeft: 20,
    padding: '0 13px',
    color: '#8380ff',
    fontWeight: 600,
  },
  guideButton: {
    gridArea: 'guide-button',
    fontSize: 20,
    borderRadius: 20,
    color: 'white',
    backgroundColor: '#8380ff',
    ...theme.defaults.castShadow.light,
  },
  circleButton: {
    ...theme.defaults.circleButton,
    border: `2px solid ${theme.palette.primary[500]}`,
    backgroundColor: theme.palette.gray[600],
    '&#add-thought, &#create-plan': {
      bottom: 10,
      right: 10,
    },
    '&#edit-plan': {
      bottom: 10,
      left: 10,
    },
    '&#create-plan': {
      '&:disabled': {
        opacity: 0.5,
      },
    },'&#search': {
      top: 10,
      left: 10,
      opacity: 0.2,      
    },
  },
  settingsButton: {
    gridArea: 'settings-button',
    fontFamily: 'avenir',
    fontSize: 20,
    borderRadius: 20,
    color: 'white',
    backgroundColor: '#0e466399',
    willChange: 'transform',
    transition: 'transform 0.1s linear',
    ...theme.defaults.castShadow.light,
    '&:active': {
      transform: 'scale(0.99)',
      boxShadow: 'none',
    },
  }
});
