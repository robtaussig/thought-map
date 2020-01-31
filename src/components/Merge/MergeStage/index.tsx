import React, { FC } from 'react';
import { Item } from '../types';

interface MergeStageProps {
  classes: any;
  itemsToAdd: Item[];
  onClick: (index: number) => void;
}

export const MergeStage: FC<MergeStageProps> = ({ classes, itemsToAdd, onClick }) => {

  return (
    <div className={classes.mergeStage}>
      MergeStage
    </div>
  );
};

export default MergeStage;
