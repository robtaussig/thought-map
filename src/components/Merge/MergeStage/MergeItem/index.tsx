import React, { FC } from 'react';
import { Item } from '../../types';
import classNames from 'classnames';

interface MergeItemProps {
  classes: any;
  rootClassName: string;
  item: Item;
  onClick: (item: Item) => void;
  selected: boolean;
}

export const MergeItem: FC<MergeItemProps> = ({ classes, rootClassName, item, onClick, selected }) => {

  return (
    <div
      className={classNames(classes.mergeItem, rootClassName, {
        selected,
      })}
      onClick={() => onClick(item)}
    >
      <span className={classes.mergeItemCollectionName}>
        {item.collectionName}
      </span>
    </div>
  );
};

export default MergeItem;
