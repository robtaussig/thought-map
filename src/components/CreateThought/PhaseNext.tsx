import React, { FC } from 'react';
import CircleButton from '../General/CircleButton';

interface PhaseNextProps {
  classes?: any,
  id?: string,
  value?: string,
  label?: string,
  onClick: () => void,
  Icon: any,
}

export const PhaseNext: FC<PhaseNextProps> = React.memo(({ classes, id, value, label, onClick, Icon }) => {

  return (
    <CircleButton classes={classes} id={id} onClick={onClick} label={label} Icon={Icon}/>
  );
});

export default PhaseNext;
