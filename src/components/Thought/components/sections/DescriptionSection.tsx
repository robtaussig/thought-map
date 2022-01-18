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
  onLongPress: (e: any) => void;
  onDrop: () => void;
  onToggleVisibility: () => void;
  visible: boolean;
}

export const DescriptionSection: FC<DescriptionSectionProps> = ({ classes, thought, onEdit, sectionState, onLongPress, onDrop, onToggleVisibility, visible = true }) => {

    return (
        <ThoughtSection
            classes={classes}
            Icon={Description}
            field={'Description'}
            value={thought.description}
            className={'description'}
            visible={visible}
            sectionState={sectionState}
            onLongPress={onLongPress}
            onDrop={onDrop}
            onToggleVisibility={onToggleVisibility}
            edit={{
                type: EditTypes.TextArea,
                onEdit,
            }}
        />
    );
};

export default DescriptionSection;
