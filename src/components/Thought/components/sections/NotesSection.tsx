import React, { FC } from 'react';
import ThoughtSection from './ThoughtSection';
import NotesIcon from '@material-ui/icons/Notes';
import { Note } from '../../../../store/rxdb/schemas/note';
import { EditTypes, SectionState } from '../../types';
import { useSelector } from 'react-redux';
import { settingSelector } from '../../../../reducers/settings';
import { noteSelector } from '../../../../reducers/notes';

interface NotesSectionProps {
  classes: any;
  notes: Note[];
  onEdit: (idx: number, value: string) => void;
  onCreate: (value: string) => void;
  onDelete: (idx: number) => void;
  sectionState: SectionState;
  onLongPress: (e: any) => void;
  onDrop: () => void;
  onToggleVisibility: () => void;
  visible: boolean;
}

export const NotesSection: FC<NotesSectionProps> = ({ classes, notes, onEdit, onCreate, onDelete, sectionState, onLongPress, onDrop, onToggleVisibility, visible = true }) => {
    const settings = useSelector(settingSelector);
    const stateNotes = useSelector(noteSelector);
    const notesToUse = settings.useAutoSuggest ? Object.values(stateNotes) : null;

    return (
        <ThoughtSection
            classes={classes}
            Icon={NotesIcon}
            field={'Notes'}
            value={notes.map(note => note.text)}
            className={'notes'}
            linkifyValues={true}
            visible={visible}
            sectionState={sectionState}
            onLongPress={onLongPress}
            onDrop={onDrop}
            onToggleVisibility={onToggleVisibility}
            edit={{
                type: EditTypes.Text,
                onEdit,
                onCreate: onCreate,
                onDelete: onDelete,
                autoSuggest: notesToUse ? notesToUse.map(note => note.text) : undefined,
            }}
        />
    );
};

export default NotesSection;
