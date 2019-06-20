export const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.palette.gray[500],
    overflow: 'hidden',
    '& > .isFocus': {
      flex: 1,
      ...theme.defaults.castShadow.light,
      margin: 50,
      backgroundColor: theme.palette.gray[0],
    }
  },
  phase: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    '& label': {
      textTransform: 'uppercase',
      margin: 10,
    },
  },
  inputLabel: {    
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.gray[700],
    position: 'relative',
    '&#title': {
      gridArea: 'title-input',
    },
    '&#note': {
      marginRight: 30,
    },
    '& > div': {
      ...theme.defaults.underlineInput,
    },
  },
  inputField: {
    height: '100%',
    fontSize: 20,
  },
  selectLabel: {
    display: 'flex',
    flexDirection: 'column',    
    color: theme.palette.gray[700],
    '&#type': {
      gridArea: 'type-input',
      '& > select': {
        backgroundColor: 'white',
      }
    },
    '&#tag': {
      '& > select': {
        backgroundColor: 'transparent',
        color: 'white',
      },
    }
  },
  selectInput: {
    flex: '0 0 40px',
    fontSize: 20,
    border: `none`,
  },
  option: {
    
  },
  dateLabel: {
    display: 'flex',
    flexDirection: 'column',    
    color: theme.palette.gray[700],
    '&#date': {
      gridArea: 'date-input',
    },
  },
  dateField: {
    flex: '0 0 40px',
    fontSize: 20,
    border: `1px solid ${theme.palette.gray[300]}`,
    borderRadius: '5px',
    backgroundColor: 'white',
  },
  textAreaLabel: {
    display: 'flex',
    flexDirection: 'column',    
    color: theme.palette.gray[700],
    '&#description': {
      gridArea: 'description-input',
      marginBottom: 10,
      flex: 1,
    },
  },
  textAreaInput: {
    flex: 1,
    fontSize: 20,
    border: `1px solid ${theme.palette.gray[300]}`,
    borderRadius: '5px',
  },
  hideDescriptionButton: {
    marginTop: 10,
  },
  phase1: {
    '&:not(.isFocus)': {
      width: '100%',
      display: 'grid',
      gridTemplateAreas: `"header title-input"`,
      gridTemplateRows: 'repeat(1, 1fr)',
      backgroundColor: 'white',
      borderBottom: `1px solid ${theme.palette.gray[300]}`,
    },
    '& #add-notes': {
      right: 'unset',
      left: 0,
    }
  },
  phase2: {
    '&:not(.isFocus)': {
      width: '100%',
      backgroundColor: 'white',
      borderBottom: `1px solid ${theme.palette.gray[300]}`,
    },
    '& #add-tags': {
      right: 'unset',
      left: 0,
    }
  },
  phase3: {
    '& #add-notes': {
      right: 'unset',
      left: 0,
    }
  },
  addTagButton: {
    color: theme.palette.secondary[500],
  },
  deleteTagButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: 'white',
    '& > svg': {
      height: 15,
      width: 15,
    }
  },
  tagGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: '5px',
    margin: 5,
    '& > li': {
      position: 'relative',
      border: '1px solid black',
      padding: '10px 0',
      textAlign: 'center',
      borderRadius: '5px',
      backgroundColor: theme.palette.primary[500],
      color: 'white',
    },
    '& > *': {
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  },
  addNoteButton: {
    color: theme.palette.secondary[500],
  },
  deleteNoteButton: {
    position: 'absolute',
    right: -25,
    color: theme.palette.red[500],
  },
  header: {
    gridArea: 'header',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButton: {
    ...theme.defaults.circleButton,
    '&#return-home': {
      left: 0,
      top: 0,
      opacity: '0.5!important',
      display: 'none',
    },
    '&#create-thought': {
      bottom: 0,
      right: 0,
      opacity: 0.5,
      border: `2px solid ${theme.palette.gray[500]}`,
      '&:not([disabled])': {
        opacity: 1,
        border: `2px solid ${theme.palette.primary[500]}`,
        '&:hover': {
          transform: 'scale(1.1)',
          ...theme.defaults.castShadow.heavy,
        },
        '&:active': {
          transform: 'scale(1)',
          boxShadow: 'none',
        },
      },
    },
    [theme.breakpoints.down('sm')]: {
      top: 'unset',
      bottom: 0,
      '&#return-home': {
        left: 'unset',
        right: 0,
        bottom: 'unset',
        display: 'block',
      },
    },
  }
});