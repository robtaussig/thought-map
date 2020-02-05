import React, { FC } from 'react';

interface FieldsProps {
  classes: any;
  mutualFields: string[];
  toPick: string[];
}

const parseField = (field: string): string => {
  if (field === 'planId') return 'plan';
  return field;
};

export const Fields: FC<FieldsProps> = ({ classes, mutualFields, toPick }) => {

  return (
    <>
      {toPick.map(field => {
        return (
          <span key={`to-pick-${field}`} className={classes.pickableField}>
            {parseField(field)}
          </span>
        );
      })}
      {mutualFields.map(field => {
        return (
          <span key={`mutual-field-${field}`} className={classes.mutualField}>
            {parseField(field)}
          </span>
        );
      })}
    </>
  );
};

export default Fields;
