import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { thoughtSelector } from '../../../reducers/thoughts';
import StagedItem from './staged-item';

interface StagingItemsProps {
  classes: any;
  isStaging: boolean;
  items: string[];
}

export const StagingItems: FC<StagingItemsProps> = ({ classes, isStaging, items }) => {
  const thoughts = useSelector(thoughtSelector);
  const stagedThoughts = useMemo(() => {
    return items.map(thoughtId => {
      return thoughts.find(({ id }) => id === thoughtId);
    });
  }, [thoughts, items]);

  return (
    <div className={classes.stagingItems}>
      {stagedThoughts.map(thought => {
        return (
          <StagedItem
            key={`${thought.id}-staged-item`}
            classes={classes}
            isStaging={isStaging}
            item={thought}
          />
        );
      })}
    </div>
  );
};

export default StagingItems;
