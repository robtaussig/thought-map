import React, { FC } from 'react';
import { Item } from '../../types';
import classNames from 'classnames';
import Clear from '@material-ui/icons/Clear';

interface MergeItemProps {
  classes: any;
  item: Item;
  onRemove: () => void;
  onClick: (event: any, item: Item) => void;
  selected: boolean;
}

export const MergeItem: FC<MergeItemProps> = ({ classes, item, onClick, onRemove, selected }) => {

  return (
    <div
      className={classNames(classes.mergeItem, {
        selected,
      })}
      onClick={(e) => onClick(e, item)}
    >
      {selected ? (
        <button
          className={classNames(
            classes.mergeItemCollectionName,
            classes.removeButton
          )}
          onClick={onRemove}
        >
          <Clear/>
        </button>
      ) : (
        <span className={classes.mergeItemCollectionName}>
          {item.collectionName}
        </span>
      )}
    </div>
  );
};

export default MergeItem;
