import React, { FC } from 'react';
import { Item } from '../types';

interface MergeStageProps {
  classes: any;
  itemsToAdd: Item[];
  onClick: (index: number) => void;
  currentItemIndex: number;
}

export const MergeStage: FC<MergeStageProps> = ({ classes, itemsToAdd, onClick, currentItemIndex }) => {

  return (
    <div className={classes.mergeStage}>
      MergeStage
    </div>
  );
};

export default MergeStage;
