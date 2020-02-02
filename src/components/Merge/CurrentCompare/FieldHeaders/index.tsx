import React, { FC } from 'react';

interface FieldHeadersProps {
  classes: any;
  type: string;
}

export const FieldHeaders: FC<FieldHeadersProps> = ({ classes, type }) => {

  return (
    <div className={classes.fieldHeaders}>
      <h3 className={'type'}>{type}</h3>
      <h3 className={'left'}>Left</h3>
      <h3 className={'right'}>Right</h3>
      <h3 className={'custom'}>Custom</h3>
    </div>
  );
};

export default FieldHeaders;
