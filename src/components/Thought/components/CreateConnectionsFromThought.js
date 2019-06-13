import React, { Fragment } from 'react';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';

export const CreateConnectionsFromThought = ({ classes, thought }) => {

  return (
    <Fragment>
      <ChevronLeft className={classes.connectionFrom}/>
      <ChevronRight className={classes.connectionTo}/>
    </Fragment>
  );
};

export default CreateConnectionsFromThought;
