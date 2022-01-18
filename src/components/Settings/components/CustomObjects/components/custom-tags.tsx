import React, { FC } from 'react';
import { CustomObjectType } from '../../../../../store/rxdb/schemas/customObject';
import CustomObjectsBase from './base';

export const CustomTags: FC = () => (
  <CustomObjectsBase
    objectType={CustomObjectType.Tag}
  />
);

export default CustomTags;
