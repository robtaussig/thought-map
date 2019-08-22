import React, { FC } from 'react';

interface PriorityFieldsProps {
  classes: any,
}

export const PriorityFields: FC<PriorityFieldsProps> = ({ classes }) => {

  return (
    <React.Fragment>
      <h3 className={classes.fieldHeader}>Title</h3>
      <h3 className={classes.fieldHeader}>Date</h3>
      <h3 className={classes.fieldHeader}>Status</h3>
    </React.Fragment>
  );
};

export default PriorityFields;
