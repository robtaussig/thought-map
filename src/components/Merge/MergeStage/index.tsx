import React, { FC, useState, useCallback } from 'react';
import { Item } from '../types';
import { useMergeStageStyles } from '../styles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import classNames from 'classnames';
import MergeItem from './MergeItem';

interface MergeStageProps {
  rootClassName: string;
  itemsToAdd: Item[];
  onClick: (index: number) => void;
  currentItemIndex: number;
}

export const MergeStage: FC<MergeStageProps> = ({ rootClassName, itemsToAdd, onClick, currentItemIndex }) => {
  const classes = useMergeStageStyles({});
  const [scanIndex, setScanIndex] = useState(currentItemIndex);
  
  const leftItem = itemsToAdd[scanIndex - 1];
  const middleItem = itemsToAdd[scanIndex];
  const rightItem = itemsToAdd[scanIndex + 1];

  const handleClickItem = useCallback((item) => {
    onClick(itemsToAdd.indexOf(item));
  }, [itemsToAdd]);

  return (
    <div className={classNames(classes.root, rootClassName)}>
      <h2 className={classes.title}>To be added ({itemsToAdd.length})</h2>
      <button
        className={classes.scanLeftButton}
        onClick={() => setScanIndex(prev => prev - 1)}
        disabled={scanIndex === 0}
      >
        <ChevronLeft/>
      </button>
      {leftItem && (
        <MergeItem
          classes={classes}
          rootClassName={classes.leftItem}
          item={leftItem}
          onClick={handleClickItem}
          selected={itemsToAdd.indexOf(leftItem) === currentItemIndex}
        />
      )}
      {middleItem && (
        <MergeItem
          classes={classes}
          rootClassName={classes.middleItem}
          item={middleItem}
          onClick={handleClickItem}
          selected={itemsToAdd.indexOf(middleItem) === currentItemIndex}
        />
      )}
      {rightItem && (
        <MergeItem
          classes={classes}
          rootClassName={classes.rightItem}
          item={rightItem}
          onClick={handleClickItem}
          selected={itemsToAdd.indexOf(rightItem) === currentItemIndex}
        />
      )}
      <button
        className={classes.scanRightButton}
        onClick={() => setScanIndex(prev => prev + 1)}
        disabled={scanIndex === itemsToAdd.length - 1}
      >
        <ChevronRight/>
      </button>
    </div>
  );
};

export default MergeStage;
