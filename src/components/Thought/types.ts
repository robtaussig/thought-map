import { PriorityOption } from './'
import { Notes, Settings } from 'reducers';
import { Thought } from 'store/rxdb/schemas/thought';
import { Tag } from 'store/rxdb/schemas/tag';
import { Note as NoteType } from 'store/rxdb/schemas/note';
import { Status as StatusType } from 'store/rxdb/schemas/status';

export interface ThoughtInformationProps {
  classes: any;
  thought: Thought;
  tags: Tag[];
  notes: NoteType[];
  statusOptions: string[];
  typeOptions: string[];
  tagOptions: string[];
  priorityOptions: PriorityOption[];
  onUpdate: (thought: Thought) => void;
  editState: boolean;
  onEditState: (edit: boolean) => void;
  stateNotes: Notes;
  stateSettings: Settings;
  statuses: StatusType[];
}

export interface EditedMap {
  [id: string]: string;
}

export interface EditedObject {
  thoughtId: string;
  text: string;
}

export interface ChangeValue {
  value: any;
}

export interface ChangeType {
  target: ChangeValue;
}
