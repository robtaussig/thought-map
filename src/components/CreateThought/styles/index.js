export const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#51759578',
    '& > .isFocus': {
      flex: 1,
      ...theme.defaults.castShadow.light,
      margin: 50,
      backgroundColor: 'white',
    }
  },
  phase: {
    display: 'flex',
    flexDirection: 'column',
    '& label': {
      textTransform: 'uppercase',
      margin: 10,
    },
  },
  phaseInputLabel: {    
    display: 'flex',
    flexDirection: 'column',
    color: '#919191',
    '&#title': {
      gridArea: 'title-input',
    },
    '& > div': {
      ...theme.defaults.underlineInput,
    },
  },
  phaseInputField: {
    height: '100%',
    fontSize: 20,
  },
  phaseSelectLabel: {
    display: 'flex',
    flexDirection: 'column',    
    color: '#919191',
    '&#type': {
      gridArea: 'type-input',
    },
  },
  phaseSelect: {
    flex: '0 0 40px',
    fontSize: 20,
    border: '1px solid hsla(341, 97%, 59%, 0.2)',
  },
  phaseOption: {
    
  },
  phaseDateLabel: {
    display: 'flex',
    flexDirection: 'column',    
    color: '#919191',
    '&#date': {
      gridArea: 'date-input',
    },
  },
  phaseDateField: {
    flex: '0 0 40px',
    fontSize: 20,
    border: '1px solid hsla(341, 97%, 59%, 0.2)',
    borderRadius: '5px',
    backgroundColor: 'rgb(248, 248, 248)',
  },
  phaseDescriptionLabel: {
    display: 'flex',
    flexDirection: 'column',    
    color: '#919191',
    '&#description': {
      gridArea: 'description-input',
      marginBottom: 10,
      flex: 1,
    },
  },
  phaseDescriptionField: {
    flex: 1,
    fontSize: 20,
    border: '1px solid hsla(341, 97%, 59%, 0.2)',
    borderRadius: '5px',
  },
  phaseNextButton: {
    height: 80,
    ...theme.defaults.bubbleButton,
  },
  phase1: {
    '&:not(.isFocus)': {
      width: '100%',
      display: 'grid',
      gridTemplateAreas: `"header title-input"
                        "type-input date-input"`,
      gridTemplateRows: 'repeat(2, 1fr)',
      backgroundColor: 'white',
      borderBottom: '1px solid gainsboro',
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
      borderBottom: '1px solid gainsboro',
    },
    '& #add-tags': {
      right: 'unset',
      left: 0,
    }
  },
  addNoteButton: {
    color: '#00b302',
  },
  deleteNoteButton: {
    position: 'absolute',
    left: 10,
    color: '#b70000',
  },
  phaseHeader: {
    gridArea: 'header',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    position: 'fixed',
    border: '2px solid #bada55',
    top: 0,
    right: 0,
    margin: 30,
    height: 70,
    width: 70,
    borderRadius: '50%',
    backgroundColor: '#2f2f2f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s linear',
    color: 'white',
    opacity: 0.5,
    '&:not([disabled])': {
      opacity: 1,
      '&:hover': {
        transform: 'scale(1.1)',
        ...theme.defaults.castShadow.heavy,
      },
      '&:active': {
        transform: 'scale(1)',
        boxShadow: 'none',
      },
    },
    /**
     * Small
     */
    [theme.breakpoints.down('sm')]: {
      top: 'unset',
      bottom: 0,
      transition: 'all 0.1s linear',
      '&:not([disabled])': {
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
  }
});