import React from 'react';
import AddButton from '../Home/AddButton';

export const PhaseNext = React.memo(({ classes, id, value, label, onClick, Icon }) => {

  return (
    <AddButton classes={classes} id={id} onClick={onClick} label={label} Icon={Icon}/>
  );
});

export default PhaseNext;
