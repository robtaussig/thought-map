import React, { FC } from 'react';

interface FieldsProps {
  classes: any;
  mutualFields: string[];
  toPick: string[];
}

export const Fields: FC<FieldsProps> = ({ classes, mutualFields, toPick }) => {

  return (
    <>
      {toPick.map(field => {
        return (
          <span key={`to-pick-${field}`} className={classes.pickableField}>
            {field}
          </span>
        );
      })}
      {mutualFields.map(field => {
        return (
          <span key={`mutual-field-${field}`} className={classes.mutualField}>
            {field}
          </span>
        );
      })}
    </>
  );
};

export default Fields;
