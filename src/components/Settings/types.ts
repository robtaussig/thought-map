import { SettingState } from "../../types";

export interface DataProps {
  classes: any,
  settings: SettingState
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
  WAS_FIXED = 'FIXED',
  REQUIRES_MANUAL_FIX = 'REQUIRES MANUAL FIX',
  SHOULD_REPORT = 'SHOULD REPORT',
  REQUIRES_RESTART = 'REQUIRES RESTART',
  NOT_BUG = 'NOT BUG',
}

export interface FormattedResult {
  action: FormattedResultActionEnum,
  furtherDetails?: string,
  table: string,
  affectedItems: any[],
  title: string,
}

export interface ChunkItem {
  table: string,
  item: any,
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