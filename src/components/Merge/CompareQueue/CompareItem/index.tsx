import React, { FC, useMemo, useRef } from 'react';
import { Comparable } from '../../types';
import classNames from 'classnames';
import { generateFieldsToPick } from '../../CurrentCompare/util';

interface CompareItemProps {
  classes: any;
  item: Comparable;
  onClick: (event: any, item: Comparable) => void;
  selected: boolean;
}

export const CompareItem: FC<CompareItemProps> = ({ classes, item, onClick, selected }) => {
    const [left, right] = item;
    const rootRef = useRef<HTMLDivElement>(null);
    const diffFields = useMemo(() => {
        const diffs: string[] = generateFieldsToPick(left.item, right.item);    
        return diffs.join(', ');
    },[left, right]);

    return (
        <div
            ref={rootRef}
            className={classNames(classes.compareItem, {
                selected,
            })}
            onClick={e => onClick(e, item)}
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
