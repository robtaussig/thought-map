import React, { FC } from 'react';
import { Comparable } from '../types';
import { useCompareQueueStyles } from '../styles';
import classNames from 'classnames';
import CompareItem from './CompareItem';

interface CompareQueueProps {
  rootClassName: string;
  comparables: Comparable[];
  onClick: (index: number) => void;
  currentItemIndex: number;
  mergable: boolean;
  onMerge: () => void;
}

export const CompareQueue: FC<CompareQueueProps> = ({
    rootClassName,
    comparables,
    onClick,
    currentItemIndex,
    mergable,
    onMerge,
}) => {
    const classes = useCompareQueueStyles({});

    const handleClickItem = (event: any, item: Comparable) => {
        event.target.scrollIntoView({ behavior: 'smooth', inline :'center' });
        onClick(comparables.indexOf(item));
    };

    return (
        <div className={classNames(classes.root, rootClassName)}>
            <h2 className={classes.title}>Comparables ({comparables.length})</h2>
            <ul className={classes.items}>
                {mergable && (
                    <button className={classes.readyToMergeButton} onClick={onMerge}>
            Ready to merge!
                    </button>
                )}
                {comparables.map((comparable, idx) => {
                    return (
                        <CompareItem
                            key={`comparable-${idx}`}
                            classes={classes}
                            item={comparable}
                            onClick={handleClickItem}
                            selected={idx === currentItemIndex}
                        />
                    );
                })}
            </ul>
        </div>
    );
};

export default CompareQueue;
