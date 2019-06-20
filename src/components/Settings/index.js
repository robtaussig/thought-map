import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import useApp from '../hooks/useApp';
import EditPlan from '../EditPlan';

const styles = theme => ({
  root: {

  },
});

export const Settings = ({ classes }) => {
  const { history } = useApp();

  return (
    <div className={classes.root}>

    </div>
  );
};

export default withStyles(styles)(Settings);
