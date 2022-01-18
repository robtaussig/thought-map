import {
  Connection as ConnectionType,
  Note as NoteType,
  Picture as PictureType,
  Plan as PlanType,
  Status as StatusType,
  Tag as TagType,
  Template as TemplateType,
  Thought as ThoughtType
} from './store/rxdb/schemas/types';

export interface Classes {
  [className: string]: string;
}

export interface Notification {
  message: string;
}

export enum Operation {
  INSERT = 'INSERT',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
}

export interface RxChangeEvent {
  documentData: any;
  previousDocumentData: any;
  operation: Operation;
  documentId: string;
}

export type ConnectionState = {
  [id: string]: ConnectionType
};

export type ThoughtState = ThoughtType[];

export type PlanState = PlanType[];

export type NoteState = {
  [id: string]: NoteType
};

export type TagState = {
  [id: string]: TagType
};

export type PictureState = {
  [id: string]: PictureType,
};

export type SettingState = {
  [field: string]: any,
}

export type StatusState = {
  [id: string]: StatusType,
}

export type StatusesByThought = {
  [thoughtId: string]: string[],
}

export type TemplateState = TemplateType[];
