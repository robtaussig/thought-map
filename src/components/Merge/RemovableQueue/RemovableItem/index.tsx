import React, { FC, useRef } from 'react';
import { Removable } from '../../types';
import classNames from 'classnames';

interface RemovableItemProps {
  classes: any;
  item: Removable;
  onClick: (event: any) => void;
  selected: boolean;
}

export const RemovableItem: FC<RemovableItemProps> = ({ classes, onClick, selected }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rootRef}
      className={classNames(classes.removableItem, {
        selected,
      })}
      onClick={e => onClick(e)}
    >
      <span className={classes.removableItemCollectionName}>
        
      </span>
      <span>
        Removable
      </span>
    </div>
  );
};

export default RemovableItem;
