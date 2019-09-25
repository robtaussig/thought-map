import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import NotesIcon from '@material-ui/icons/Notes';
import { Note } from '../../../../store/rxdb/schemas/note';
import { EditTypes } from '../../types';

interface NotesSectionProps {
  classes: any;
  notes: Note[];
  onEdit: (idx: number, value: string) => void;
  onCreate: (value: string) => void;
  onDelete: (idx: number) => void;
}

export const NotesSection: FC<NotesSectionProps> = ({ classes, notes, onEdit, onCreate, onDelete }) => {

  return (
    <ThoughtSection
      classes={classes}
      Icon={NotesIcon}
      field={'Notes'}
      value={notes.map(note => note.text)}
      className={'notes'}
      visible={true}
      edit={{
        type: EditTypes.Text,
        onEdit,
        onCreate: onCreate,
        onDelete: onDelete,
        onChangeVisibility: console.log,
      }}
    />
  );
};

export default NotesSection;
