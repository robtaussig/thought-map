import './styles.css';

export const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'grid',
    padding: 20,
    backgroundColor: '#d2d2d2',
    gap: '20px',
    gridTemplateAreas: `"content header"
                        "content header"
                        "content guide-button"
                        "content settings-button"`,
    gridTemplateRows: 'repeat(4, 1fr)',
    gridTemplateColumns: 'repeat(2, 1fr)',
    /**
     * Small
     */
    [theme.breakpoints.down('sm')]: {
      gridTemplateAreas: `"content content"
                          "guide-button guide-button"
                          "settings-button settings-button"
                          "header header"`,
      gridTemplateRows: '5fr minmax(50px, 1fr) minmax(50px, 1fr) minmax(50px, 1fr)',
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    //Dev
    '& > *': {
      // border: '1px solid black',
    }
  },
  content: {
    gridArea: 'content',
    border: '5px solid #1f719e',
    backgroundColor: 'white',
    ...theme.defaults.castShadow.light,
  },
  guideButton: {
    gridArea: 'guide-button',
    border: '5px solid #1f719e',
    fontSize: 20,
    ...theme.defaults.castShadow.light,
  },
  header: {
    gridArea: 'header',
    margin: 'auto',
    fontSize: 50,
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
      '&:hover': {
        transform: 'unset',
      },
      '&:active, &:focus': {
        transform: 'scale(0.9)',
        boxShadow: 'none',
      },
    },
  },
  settingsButton: {
    gridArea: 'settings-button',
    border: '5px solid #1f719e',
    fontSize: 20,
    ...theme.defaults.castShadow.light,
  }
});
