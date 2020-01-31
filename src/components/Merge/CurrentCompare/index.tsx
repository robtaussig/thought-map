import React, { FC } from 'react';
import { Comparable } from '../types';

interface CurrentCompareProps {
  classes: any;
  comparable: Comparable;
}

export const CurrentCompare: FC<CurrentCompareProps> = ({ classes, comparable }) => {

  return (
    <div className={classes.currentCompare}>
      CurrentCompare
    </div>
  );
};

export default CurrentCompare;
