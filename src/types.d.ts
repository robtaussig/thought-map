import { RouteComponentProps } from 'react-router-dom';
import {
  Thought as ThoughtType,
  Plan as PlanType,
  Note as NoteType,
  Tag as TagType,
  Connection as ConnectionType,
  Template as TemplateType,
  Picture as PictureType,
  Setting as SettingType,
  Status as StatusType
} from './store/rxdb/schemas/types';

export interface Classes {
  [className: string]: string;
}

export interface Notification {
  message: string;
}

export enum Operation {
  INSERT = 'INSERT',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
}

export interface RxChangeEvent {
  documentData: any;
  operation: Operation;
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
