import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import Category from '@material-ui/icons/Category';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { EditTypes, SectionState } from '../../types';

interface TypeSectionProps {
  classes: any;
  thought: Thought;
  typeOptions: string[];
  onEdit: (value: string) => void;
  sectionState: SectionState;
  onLongPress: (e: any) => void;
  onDrop: () => void;
  onToggleVisibility: () => void;
}

export const TypeSection: FC<TypeSectionProps> = ({ classes, thought, typeOptions, onEdit, sectionState, onLongPress, onDrop, onToggleVisibility }) => {

  return (
    <ThoughtSection
      classes={classes}
      Icon={Category}
      field={'Type'}
      value={thought.type}
      className={'type'}
      visible={true}
      sectionState={sectionState}
      onLongPress={onLongPress}
      onDrop={onDrop}
      onToggleVisibility={onToggleVisibility}
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
