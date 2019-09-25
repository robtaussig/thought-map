import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import Description from '@material-ui/icons/Description';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { EditTypes } from '../../types';

interface DescriptionSectionProps {
  classes: any;
  thought: Thought;
  onEdit: (value: number) => void;
}

export const DescriptionSection: FC<DescriptionSectionProps> = ({ classes, thought, onEdit }) => {

  return (
    <ThoughtSection
      classes={classes}
      Icon={Description}
      field={'Description'}
      value={thought.description}
      className={'description'}
      visible={true}
      edit={{
        type: EditTypes.TextArea,
        onEdit,
        onChangeVisibility: console.log,
      }}
    />
  );
};

export default DescriptionSection;
