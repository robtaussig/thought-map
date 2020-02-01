import React, { FC, useState, useCallback } from 'react';
import { Comparable } from '../types';
import { useCompareQueueStyles } from '../styles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import classNames from 'classnames';
import CompareItem from './CompareItem';

interface CompareQueueProps {
  rootClassName: string;
  comparables: Comparable[];
  onClick: (index: number) => void;
  currentItemIndex: number;
}

export const CompareQueue: FC<CompareQueueProps> = ({ rootClassName, comparables, onClick, currentItemIndex }) => {
  const classes = useCompareQueueStyles({});
  const [scanIndex, setScanIndex] = useState(currentItemIndex);
  
  const leftItem = comparables[scanIndex - 1];
  const middleItem = comparables[scanIndex];
  const rightItem = comparables[scanIndex + 1];

  const handleClickItem = useCallback((item) => {
    onClick(comparables.indexOf(item));
  }, [comparables]);

  return (
    <div className={classNames(classes.root, rootClassName)}>
      <h2 className={classes.title}>Pick from both</h2>
      <button
        className={classes.scanLeftButton}
        onClick={() => setScanIndex(prev => prev - 1)}
        disabled={scanIndex === 0}
      >
        <ChevronLeft/>
      </button>
      {leftItem && (
        <CompareItem
          classes={classes}
          rootClassName={classes.leftItem}
          item={leftItem}
          onClick={handleClickItem}
          selected={comparables.indexOf(leftItem) === currentItemIndex}
        />
      )}
      {middleItem && (
        <CompareItem
          classes={classes}
          rootClassName={classes.middleItem}
          item={middleItem}
          onClick={handleClickItem}
          selected={comparables.indexOf(middleItem) === currentItemIndex}
        />
      )}
      {rightItem && (
        <CompareItem
          classes={classes}
          rootClassName={classes.rightItem}
          item={rightItem}
          onClick={handleClickItem}
          selected={comparables.indexOf(rightItem) === currentItemIndex}
        />
      )}
      <button
        className={classes.scanRightButton}
        onClick={() => setScanIndex(prev => prev + 1)}
        disabled={scanIndex === comparables.length - 1}
      >
        <ChevronRight/>
      </button>
    </div>
  );
};

export default CompareQueue;
