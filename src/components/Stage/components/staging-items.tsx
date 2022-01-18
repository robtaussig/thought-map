import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { thoughtSelector } from '../../../reducers/thoughts';
import StagedItem from './staged-item';
import { useTransition } from 'react-spring';

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
    })
      .sort((left, right) => {
        if (left.updated > right.updated) return -1;
        return 1;
      });
  }, [thoughts, items]);

  const transitions = useTransition(stagedThoughts, {
    keys: item => `${item.id}-staged-item`,
    unique: true,
    trail: 2,
    from: { opacity: 0, transform: 'scale(0)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0)' },
  });

  return (
    <div className={classes.stagingItems}>
      {transitions((props, item) => {
        return (
          <StagedItem
            classes={classes}
            isStaging={isStaging}
            item={item}
            style={props}
          />
        );
      })}
    </div>
  );
};

export default StagingItems;
