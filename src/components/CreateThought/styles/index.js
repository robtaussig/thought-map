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
    '& label': {
      textTransform: 'uppercase',
    },
  },
  phaseInputLabel: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 10px',
    color: '#919191',
    '&#title': {
      gridArea: 'title-input',
    },
    '& > div': {
      flex: '0 0 40px',
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
    margin: '0 10px',
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
  phase1: {
    display: 'grid',
    gridTemplateAreas: `"header header"
                        "title-input type-input"
                        "description-input description-input"`,
    gridTemplateRows: '40px 60px 1fr',
    gridTemplateColumns: 'repeat(2, 1fr)',
    [theme.breakpoints.down('sm')]: {
      gridTemplateAreas: `"header header"
            "title-input title-input"
            "type-input type-input"
            "description-input description-input"`,
      gridTemplateRows: '40px 80px 80px 1fr',
      gridTemplateColumns: 'repeat(2, 1fr)',
    }
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
  }
});