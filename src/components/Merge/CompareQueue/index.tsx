import React, { FC } from 'react';
import { Comparable } from '../types';

interface CompareQueueProps {
  classes: any;
  comparables: Comparable[];
  onClick: (index: number) => void;
  currentItemIndex: number;
}

export const CompareQueue: FC<CompareQueueProps> = ({ classes, comparables, onClick, currentItemIndex }) => {

  return (
    <div className={classes.compareQueue}>
      CompareQueue
    </div>
  );
};

export default CompareQueue;
