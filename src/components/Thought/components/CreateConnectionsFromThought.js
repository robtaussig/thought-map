import React, { Fragment } from 'react';
import ChevronRight from '@material-ui/icons/ChevronRight';

export const CreateConnectionsFromThought = ({ classes, thought }) => {

  return (
    <Fragment>
      <ChevronRight className={classes.connectionFrom}/>
      <ChevronRight className={classes.connectionTo}/>
    </Fragment>
  );
};

export default CreateConnectionsFromThought;
