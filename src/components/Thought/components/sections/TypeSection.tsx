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
  onToggleVisibility: () => void;
  visible: boolean;
  sectionOrder: string[];
}

export const TypeSection: FC<TypeSectionProps> = ({ classes, sectionOrder, thought, typeOptions, onEdit, sectionState, onToggleVisibility, visible = true }) => {

  return (
    <ThoughtSection
      classes={classes}
      sectionOrder={sectionOrder}
      section={'type'}
      Icon={Category}
      field={'Type'}
      value={thought.type || ''}
      className={'type'}
      visible={visible}
      sectionState={sectionState}
      onToggleVisibility={onToggleVisibility}
      edit={{
        type: EditTypes.Select,
        options: typeOptions,
        onEdit,
      }}
    />
  );
};

export default TypeSection;
