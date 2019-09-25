import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import Category from '@material-ui/icons/Category';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { EditTypes } from '../../types';

interface TypeSectionProps {
  classes: any;
  thought: Thought;
  typeOptions: string[];
  onEdit: (value: string) => void;
}

export const TypeSection: FC<TypeSectionProps> = ({ classes, thought, typeOptions, onEdit }) => {

  return (
    <ThoughtSection
      classes={classes}
      Icon={Category}
      field={'Type'}
      value={thought.type}
      className={'type'}
      visible={true}
      edit={{
        type: EditTypes.Select,
        options: typeOptions,
        onEdit,
        onChangeVisibility: console.log,
      }}
    />
  );
};

export default TypeSection;
