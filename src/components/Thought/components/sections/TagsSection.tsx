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
  onToggleVisibility: () => void;
  sectionOrder: string[];
  visible: boolean;
}

export const TagsSection: FC<TagsSectionProps> = ({ classes, sectionOrder, tags, tagOptions, onDelete, onCreate, sectionState, onToggleVisibility, visible = true }) => {

  return (
    <ThoughtSection
      classes={classes}
      sectionOrder={sectionOrder}
      section={'tags'}
      Icon={Style}
      field={'Tags'}
      value={tags.map(({ text }) => text)}
      className={'tags'}
      visible={visible}
      sectionState={sectionState}
      onToggleVisibility={onToggleVisibility}
      edit={{
        type: EditTypes.Select,
        options: ['', ...tagOptions],
        onCreate,
        onDelete,
      }}
    />
  );
};

export default TagsSection;
