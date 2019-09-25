import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Style from '@material-ui/icons/Style';
import Check from '@material-ui/icons/Check';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import { Tag } from '../../../../store/rxdb/schemas/tag';
import { EditTypes } from '../../types';
import classNames from 'classnames';

interface TagsSectionProps {
  classes: any;
  tags: Tag[];
  tagOptions: string[];
  onDelete: (idx: number) => void;
  onCreate: (value: string) => void;
}

export const TagsSection: FC<TagsSectionProps> = ({ classes, tags, tagOptions, onDelete, onCreate }) => {

  return (
    <ThoughtSection
      classes={classes}
      Icon={Style}
      field={'Tags'}
      value={tags.map(({ text }) => text)}
      className={'tags'}
      visible={true}
      edit={{
        type: EditTypes.Select,
        options: tagOptions,
        onCreate,
        onDelete,
        onChangeVisibility: console.log,
      }}
    />
  );
};

export default TagsSection;
