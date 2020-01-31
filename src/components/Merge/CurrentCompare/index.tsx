import React, { FC } from 'react';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { Comparable, Item } from '../types';

interface CurrentCompareProps {
  classes: any;
  comparable: Comparable;
  onPick: (item: Item) => void;
  thoughts: Thought[];
}

export const CurrentCompare: FC<CurrentCompareProps> = ({ classes, comparable, onPick, thoughts }) => {

  return (
    <div className={classes.currentCompare}>
      CurrentCompare
    </div>
  );
};

export default CurrentCompare;
