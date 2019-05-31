import React from 'react';
import CircleButton from '../General/CircleButton';

export const PhaseNext = React.memo(({ classes, id, value, label, onClick, Icon }) => {

  return (
    <CircleButton classes={classes} id={id} onClick={onClick} label={label} Icon={Icon}/>
  );
});

export default PhaseNext;
