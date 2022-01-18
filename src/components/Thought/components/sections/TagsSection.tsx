import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import Style from '@material-ui/icons/Style';
import { Tag } from '../../../../store/rxdb/schemas/tag';
import { EditTypes, SectionState } from '../../types';

interface TagsSectionProps {
  classes: any;
  tags: Tag[];
  tagOptions: string[];
  onDelete: (idx: number) => void;
  onCreate: (value: string) => void;
  sectionState: SectionState;
  onLongPress: (e: any) => void;
  onDrop: () => void;
  onToggleVisibility: () => void;
  visible: boolean;
}

export const TagsSection: FC<TagsSectionProps> = ({ classes, tags, tagOptions, onDelete, onCreate, sectionState, onLongPress, onDrop, onToggleVisibility, visible = true }) => {

    return (
        <ThoughtSection
            classes={classes}
            Icon={Style}
            field={'Tags'}
            value={tags.map(({ text }) => text)}
            className={'tags'}
            visible={visible}
            sectionState={sectionState}
            onLongPress={onLongPress}
            onDrop={onDrop}
            onToggleVisibility={onToggleVisibility}
            edit={{
                type: EditTypes.Select,
                options: tagOptions,
                onCreate,
                onDelete,
            }}
        />
    );
};

export default TagsSection;
