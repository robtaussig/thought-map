import React, { FC } from 'react';
import { CustomInput } from '../state';

interface CustomProps {
  classes: any;
  onChange: (field: string, value: string) => void;
  customInput: CustomInput;
  mutualFields: string[];
  toPick: string[];
}

export const Custom: FC<CustomProps> = ({ classes, onChange, customInput, mutualFields, toPick }) => {

  return (
    <div className={classes.custom}>

    </div>
  );
};

export default Custom;
