import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import AddLocation from '@material-ui/icons/AddLocation';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { EditTypes, SectionState } from '../../types';

interface LocationSectionProps {
  classes: any;
  thought: Thought;
  onEdit: (value: number) => void;
  sectionState: SectionState;
  onToggleVisibility: () => void;
  sectionOrder: string[];
  visible: boolean;
}

export const LocationSection: FC<LocationSectionProps> = ({ classes, sectionOrder, thought, onEdit, sectionState, onToggleVisibility, visible = true }) => {
  return (
    <ThoughtSection
      classes={classes}
      sectionOrder={sectionOrder}
      section={'location'}
      Icon={AddLocation}
      field={'Location'}
      value={thought.location ?? ''}
      className={'location'}
      visible={visible}
      sectionState={sectionState}
      onToggleVisibility={onToggleVisibility}
      edit={{
        type: EditTypes.Text,
        onEdit,
      }}
    />
  );
};

export default LocationSection;
