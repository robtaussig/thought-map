import React, { FC } from 'react';
import classNames from 'classnames';
import { Doc, Item } from '../../types';

interface SideProps {
  classes: any;
  rootClassName: string;
  mutualFields: string[];
  toPick: string[];
  item: Doc;
  merged: Item;
  onSelect: (field: string, value: any) => void;
}

export const Side: FC<SideProps> = ({
  classes,
  rootClassName,
  mutualFields,
  toPick,
  item,
  merged,
  onSelect,
}) => {

  const handleSelect = (field: string) => () => {
    onSelect(field, item[field]);
  };

  return (
    <>
      {toPick.map((field, idx) => {
        return (
          <span
            key={`to-pick-${field}`}
            style={{ gridRow: `${idx + 1} / span 1`}}
            onClick={handleSelect(field)}
            className={classNames(rootClassName, classes.pickableValue, {
              selected: merged.item[field] === item[field],
            })}
          >
            {item[field]}
          </span>
        );
      })}
      {mutualFields.map((field, idx) => {
        return (
          <span
            key={`mutual-field-${field}`}
            style={{ gridRow: `${toPick.length + idx + 1} / span 1`}}
            className={classNames(rootClassName, classes.mutualValue, {
              selected: merged.item[field] === item[field],
            })}
          >
            {item[field]}
          </span>
        );
      })}
    </>
  );
};

export default Side;
