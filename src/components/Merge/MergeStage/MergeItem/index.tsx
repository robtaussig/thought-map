import React, { FC } from 'react';
import { Item } from '../../types';
import classNames from 'classnames';

interface MergeItemProps {
  classes: any;
  item: Item;
  onClick: (event: any, item: Item) => void;
  selected: boolean;
}

export const MergeItem: FC<MergeItemProps> = ({ classes, item, onClick, selected }) => {

  return (
    <div
      className={classNames(classes.mergeItem, {
        selected,
      })}
      onClick={(e) => onClick(e, item)}
    >
      <span className={classes.mergeItemCollectionName}>
        {item.collectionName}
      </span>
    </div>
  );
};

export default MergeItem;
