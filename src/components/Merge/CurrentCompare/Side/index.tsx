import React, { FC } from 'react';
import classNames from 'classnames';
import { Doc, Item } from '../../types';
import { CustomInput } from '../state';
import { Plan } from '../../../../store/rxdb/schemas/plan';

interface SideProps {
  classes: any;
  rootClassName: string;
  mutualFields: string[];
  toPick: string[];
  item: Doc;
  merged: Item;
  customInput: CustomInput;
  onSelect: (field: string, value: any) => void;
  plans: Plan[];
}

const parseValue = (field: string, value: any, plans: Plan[]): string => {
  switch (value) {
    case true:
      return 'true';
    case false:
      return 'false';
    default:
      if (field === 'planId') return plans.find(({ id }) => id === value)?.name ?? 'Unknown plan';
      return value;
  }
};

export const Side: FC<SideProps> = ({
  classes,
  rootClassName,
  toPick,
  item,
  merged,
  onSelect,
  customInput,
  plans,
}) => {

  const handleSelect = (field: string) => () => {
    onSelect(field, item[field]);
  };

  return (
    <>
      {toPick.map((field, idx) => {
        return [undefined, ''].includes(customInput[field]) && (
          <span
            key={`to-pick-${field}`}
            style={{ gridRow: `${idx + 1} / span 1`}}
            onClick={handleSelect(field)}
            className={classNames(rootClassName, classes.pickableValue, {
              selected: merged.item[field] === item[field],
            })}
          >
            {parseValue(field, item[field], plans)}
          </span>
        );
      })}
    </>
  );
};

export default Side;
