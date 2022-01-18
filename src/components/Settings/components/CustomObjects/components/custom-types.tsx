import React, { FC } from 'react';
import { CustomObjectType } from '../../../../../store/rxdb/schemas/customObject';
import CustomObjectsBase from './base';

export const CustomTypes: FC = () => (
    <CustomObjectsBase
        objectType={CustomObjectType.Type}
    />
);

export default CustomTypes;
