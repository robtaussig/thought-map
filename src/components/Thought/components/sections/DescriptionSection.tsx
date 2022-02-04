import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import Description from '@material-ui/icons/Description';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { EditTypes, SectionState } from '../../types';

interface DescriptionSectionProps {
  classes: any;
  thought: Thought;
  onEdit: (value: number) => void;
  sectionState: SectionState;
  onToggleVisibility: () => void;
  sectionOrder: string[];
  visible: boolean;
}

export const DescriptionSection: FC<DescriptionSectionProps> = ({ classes, sectionOrder, thought, onEdit, sectionState, onToggleVisibility, visible = true }) => {

  return (
    <ThoughtSection
      classes={classes}
      sectionOrder={sectionOrder}
      section={'description'}
      Icon={Description}
      field={'Description'}
      value={thought.description}
      className={'description'}
      visible={visible}
      sectionState={sectionState}
      onToggleVisibility={onToggleVisibility}
      edit={{
        type: EditTypes.TextArea,
        onEdit,
      }}
    />
  );
};

export default DescriptionSection;
