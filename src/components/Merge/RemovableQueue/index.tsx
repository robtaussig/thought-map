import React, { FC } from 'react';
import { Removable } from '../types';
import { useRemovableQueueStyles } from '../styles';
import classNames from 'classnames';
import RemovableItem from './RemovableItem';

interface RemovableQueueProps {
  rootClassName: string;
  removables: Removable[];
  onClick: (index: number) => void;
  currentItemIndex: number;
}

export const RemovableQueue: FC<RemovableQueueProps> = ({
  rootClassName,
  removables,
  onClick,
  currentItemIndex,
}) => {
  const classes = useRemovableQueueStyles({});

  const handleClickItem = (idx: number) => (event: any) => {
    event.target.scrollIntoView({ behavior: 'smooth', inline :'center' });
    onClick(idx);
  };

  return (
    <div className={classNames(classes.root, rootClassName)}>
      <h2 className={classes.title}>Removables ({removables.length})</h2>
      <ul className={classes.items}>
        {removables.map((removable, idx) => {
          return (
            <RemovableItem
              key={`removable-${idx}`}
              classes={classes}
              item={removable}
              onClick={handleClickItem(idx)}
              selected={idx === currentItemIndex}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default RemovableQueue;
