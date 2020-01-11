import { StyleRules } from '@material-ui/styles';

export const styles = (theme: any): StyleRules => ({
  root: () => ({
    height: '100%',
    width: '100%',
    display: 'grid',
    overflow: 'hidden',
    gridTemplateAreas: `"nav-bar"
                        "grid-items"`,
    gridTemplateRows: '80px 1fr',
    backgroundColor: theme.palette.background[700],
    '& #staging-nav': {
      gridArea: 'nav-bar',
    },
  }),
  stagingItems: {
    gridArea: 'grid-items',
    gridTemplateColumns: '1fr',
    gridAutoRows: 'max-content',
    display: 'grid',
    gridAutoFlow: 'row',
    overflow: 'auto',
    gridRowGap: '10px',
    margin: 10,
    marginBottom: 125,
  },
  stagedItem: () => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.background[100],
    borderRadius: '5px',
    willChange: 'transform, width, height, opacity',
    '& button': {
      height: '100%',
      ...theme.defaults.centered,
    },
    '&.from': {
      backgroundColor: theme.palette.secondary[200],
    },
  }),
  stagedItemTitle: () => ({
    flex: 1,
    margin: 10,
    color: theme.palette.background[900],
  }),
  unstageButton: () => ({
    flex: '0 0 50px',
    color: theme.palette.negative[300],
  }),
  promoteButton: () => ({
    flex: '0 0 50px',
    '&:not(:disabled)': {
      color: theme.palette.secondary[500],
    },
  }),
});
