import { History } from 'history';
import { RouteComponentProps } from 'react-router-dom';
import {
  Thought as ThoughtType,
  Plan as PlanType,
  Note as NoteType,
  Tag as TagType,
  Connection as ConnectionType,
  Template as TemplateType,
  Picture as PictureType,
} from './store/rxdb/schemas/types';
import { Action, Setter } from './hooks/useXReducer';


export interface Classes {
  [className: string]: string,
}

export interface AppProps extends RouteComponentProps {
  classes: Classes,
  history: History
}

export interface Notification {
  message: string,
}

export interface Setters {
  [key: string]: Setter<any>,
}

export enum Operation {
  INSERT = 'INSERT',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
}

export interface RxChangeEventData {
  v: any,
  op: Operation
}

export interface RxChangeEvent {
  data: RxChangeEventData,
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

export type TemplateState = TemplateType[];