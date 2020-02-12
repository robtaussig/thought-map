import React, { FC } from 'react';
import { useStyles } from './style';
import classNames from 'classnames';
import { Removable } from '../types';

interface CurrentRemovableProps {
  rootClassName: string;
  removable: Removable;
  onPick: (pickRemove: boolean) => void;
}

export const CurrentRemovable: FC<CurrentRemovableProps> = ({
  rootClassName,
  removable,
  onPick,
}) => {
  const classes = useStyles({});

  return (
    <div className={classNames(classes.root, rootClassName)}>
      <button onClick={() => onPick(true)}>Keep</button>
      <button onClick={() => onPick(false)}>Reject</button>
    </div>
  );
};

export default CurrentRemovable;
