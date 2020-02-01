import React, { FC, useMemo } from 'react';
import { Comparable } from '../../types';
import classNames from 'classnames';

interface CompareItemProps {
  classes: any;
  rootClassName: string;
  item: Comparable;
  onClick: (item: Comparable) => void;
  selected: boolean;
}

export const CompareItem: FC<CompareItemProps> = ({ classes, rootClassName, item, onClick, selected }) => {
  const [left, right] = item;
  const diffFields = useMemo(() => {
    const diffs: string[] = [];
    Object.entries(left.item).forEach(([field, value]) => {
      if (field !== 'updated' && right.item[field] !== value) {
        diffs.push(field);
      }
    });
    return diffs.join(', ');
  },[left, right]);

  return (
    <div
      className={classNames(classes.compareItem, rootClassName, {
        selected,
      })}
      onClick={() => onClick(item)}
    >
      <span className={classes.compareItemCollectionName}>
        {left.collectionName}
      </span>
      <span className={classes.compareItemDiffFields}>
        {diffFields}
      </span>
    </div>
  );
};

export default CompareItem;
