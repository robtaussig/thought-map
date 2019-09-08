import { AppState } from "../../reducers";

export interface DataProps {
  classes: any,
  state: AppState
}

export enum Side {
  TOP = 'left',
  MIDDLE = 'middle',
}

export interface ChildObject {
  thoughtId: string,
}

export interface OrphanedChildSource {
  table: string,
  items: ChildObject[],
}

export interface OrphanedChildObject {
  table: string,
  item: ChildObject,
}

export interface InvalidSetting {
  field: string,
  value: string,
  reason: string,
}

export interface ValidSetting {
  values: Set<any>,
  reason: string,
}

export interface ValidSettings {
  [field: string]: ValidSetting,
}

export enum FormattedResultActionEnum {
  CAN_FIX = 'CAN FIX',
  REQUIRES_MANUAL_FIX = 'REQUIRES MANUAL FIX',
  SHOULD_REPORT = 'SHOULD REPORT',
  REQUIRES_RESTART = 'REQUIRES RESTART',
  NOT_BUG = 'NOT BUG',
}

export enum SolutionTypes {
  DELETE = 'DELETE',
  NULL_OUT_PLAN_ID = 'NULL_OUT_PLAN_ID',
}

export interface FormattedResult {
  action: FormattedResultActionEnum,
  furtherDetails?: string,
  table: string,
  affectedItems: any[],
  title: string,
  solution?: SolutionTypes,
}

export interface ChunkItem {
  table: string,
  item: any,
  solution?: SolutionTypes,
}

export interface ChunkDetails {
  furtherDetails?: string,
  items: ChunkItem[],
}

export interface Chunks {
  [title: string]: ChunkDetails
}

export interface DiagnosisChunks {
  [action: string]: Chunks
}