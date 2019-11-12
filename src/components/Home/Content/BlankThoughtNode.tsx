import React, { FC } from 'react';
import { withStyles, StyleRules } from '@material-ui/styles';

interface BlankThoughtNodeProps {
  classes: any,
}

const styles = (theme: any): StyleRules => ({
  root: {
    display: 'grid',
    width: '100%',
    padding: '20px 10px',
    backgroundColor: 'white',
    userSelect: 'none',
    gridTemplateAreas: `"header . . status"
                        "title title . status"`,
    gridTemplateRows: '10px 20px',
    gridTemplateColumns: '50px 120px 1fr 92px',
    gridGap: '5px',
  },
  plan: {
    gridArea: 'header',
    '& > div': {
      height: '100%',
      backgroundColor: theme.palette.gray[300],
    },
  },
  title: {
    gridArea: 'title',
    '& > div': {
      height: '15px',
      backgroundColor: theme.palette.gray[500],
    },
  },
  status: {
    gridArea: 'status',
    ...theme.defaults.centered,
    '& > div': {
      height: '25px',
      borderRadius: '10px',
      width: '100%',
      backgroundColor: theme.palette.secondary[500],
    },
  },
});

export const BlankThoughtNode: FC<BlankThoughtNodeProps> = ({ classes }) => {

  return (
    <div className={classes.root}>
      <div className={classes.plan}><div/></div>
      <div className={classes.title}><div/></div>
      <div className={classes.status}><div/></div>
    </div>
  );
};

export default withStyles(styles)(BlankThoughtNode);
