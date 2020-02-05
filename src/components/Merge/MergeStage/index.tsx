import React, { FC, useCallback } from 'react';
import { Item } from '../types';
import { useMergeStageStyles } from '../styles';
import classNames from 'classnames';
import MergeItem from './MergeItem';

interface MergeStageProps {
  rootClassName: string;
  itemsToAdd: Item[];
  onRemove: () => void;
  onClick: (index: number) => void;
  currentItemIndex: number;
}

export const MergeStage: FC<MergeStageProps> = ({
  rootClassName,
  itemsToAdd,
  onClick,
  onRemove,
  currentItemIndex,
}) => {
  const classes = useMergeStageStyles({});

  const handleClickItem = useCallback((event, item) => {
    event.target.scrollIntoView({ behavior: 'smooth', inline :'center' });
    onClick(itemsToAdd.indexOf(item));
  }, [itemsToAdd]);

  return (
    <div className={classNames(classes.root, rootClassName)}>
      <h2 className={classes.title}>To be added ({itemsToAdd.length})</h2>
      <ul className={classes.items}>
        {itemsToAdd.map((item, idx) => {
          return (
            <MergeItem
              key={`item-${idx}`}
              classes={classes}
              item={item}
              onClick={handleClickItem}
              onRemove={onRemove}
              selected={idx === currentItemIndex}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default MergeStage;
