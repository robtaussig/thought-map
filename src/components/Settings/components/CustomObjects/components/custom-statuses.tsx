import React, { FC } from 'react';
import { CustomObjectType } from '../../../../../store/rxdb/schemas/customObject';
import CustomObjectsBase from './base';

export const CustomStatuses: FC = () => (
  <CustomObjectsBase
    objectType={CustomObjectType.Status}
  />
);

export default CustomStatuses;
