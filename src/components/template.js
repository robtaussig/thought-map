import React, { useContext, Fragment } from 'react';
import { Context } from '../store';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

});

export const Template = React.memo(({ classes }) => {
  const dispatch = useContext(Context);

  return (
    <Fragment>
      Hello!
    </Fragment>
  );
});

export default withStyles(styles)(Template);
