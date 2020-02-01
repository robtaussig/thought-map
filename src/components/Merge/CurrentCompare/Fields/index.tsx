import React, { FC } from 'react';

interface FieldsProps {
  classes: any;
}

export const Fields: FC<FieldsProps> = ({ classes }) => {

  return (
    <div className={classes.fields}>

    </div>
  );
};

export default Fields;
