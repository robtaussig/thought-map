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
  onToggleVisibility: () => void;
  sectionOrder: string[];
  visible: boolean;
}

export const StatusSection: FC<StatusSectionProps> = ({ classes, sectionOrder, thought, statusOptions, onEdit, sectionState, onToggleVisibility, visible = true }) => {

  return (
    <ThoughtSection
      classes={classes}
      sectionOrder={sectionOrder}
      section={'status'}
      Icon={thought.status === 'completed' ? CheckBoxIcon : CheckBoxOutlineBlank}
      field={'Status'}
      value={thought.status}
      className={'status'}
      visible={visible}
      sectionState={sectionState}
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
      }}
    />
  );
};

export default StatusSection;
