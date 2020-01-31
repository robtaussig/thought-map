import React, { FC } from 'react';
import { Comparable, Item } from '../types';

interface CurrentCompareProps {
  classes: any;
  comparable: Comparable;
  onPick: (item: Item) => void;
}

export const CurrentCompare: FC<CurrentCompareProps> = ({ classes, comparable, onPick }) => {

  return (
    <div className={classes.currentCompare}>
      CurrentCompare
    </div>
  );
};

export default CurrentCompare;
