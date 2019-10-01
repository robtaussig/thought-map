import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Check from '@material-ui/icons/Check';
import CheckBoxOutlineBlank from '@material-ui/icons/CheckBoxOutlineBlank';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { EditTypes, SectionState } from '../../types';
import classNames from 'classnames';

interface StatusSectionProps {
  classes: any;
  thought: Thought;
  statusOptions: string[];
  onEdit: (value: string) => void;
  sectionState: SectionState;
  onLongPress: (e: any) => void;
  onDrop: () => void;
  onToggleVisibility: () => void;
}

export const StatusSection: FC<StatusSectionProps> = ({ classes, thought, statusOptions, onEdit, sectionState, onLongPress, onDrop, onToggleVisibility }) => {

  return (
    <ThoughtSection
      classes={classes}
      Icon={thought.status === 'completed' ? CheckBoxIcon : CheckBoxOutlineBlank}
      field={'Status'}
      value={thought.status}
      className={'status'}
      visible={true}
      sectionState={sectionState}
      onLongPress={onLongPress}
      onDrop={onDrop}
      onToggleVisibility={onToggleVisibility}
      quickActionButton={thought.status !== 'completed' && (
        <button className={classNames(classes.completeThoughtButton, {
          firstAction: thought.status === statusOptions[0],
        })} onClick={() => onEdit(
          thought.status === statusOptions[0] ?
            statusOptions[1] :
            statusOptions[statusOptions.length - 1]
        )}><Check/></button>
      )}
      edit={{
        type: EditTypes.Select,
        options: statusOptions,
        onEdit,
        onChangeVisibility: console.log,
      }}
    />
  );
};

export default StatusSection;
