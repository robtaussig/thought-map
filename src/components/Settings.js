import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import useApp from '../hooks/useApp';

const styles = theme => ({

});

export const Settings = ({ classes }) => {
  const { history } = useApp();

  return (
    <div>

    </div>
  );
};

export default withStyles(styles)(Settings);
