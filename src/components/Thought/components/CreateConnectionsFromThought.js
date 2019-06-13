import React, { Fragment } from 'react';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import CircleButton from '../../General/CircleButton';

export const CreateConnectionsFromThought = ({ classes, thought }) => {

  return (
    <Fragment>
      <CircleButton classes={classes} id={'from'} onClick={console.log} label={'Connected From'} Icon={ChevronLeft}/>
      <CircleButton classes={classes} id={'to'} onClick={console.log} label={'Connected To'} Icon={ChevronRight}/>
    </Fragment>
  );
};

export default CreateConnectionsFromThought;
