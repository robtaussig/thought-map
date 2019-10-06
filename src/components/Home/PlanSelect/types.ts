import { Status } from '../../../store/rxdb/schemas/Status';

export enum ReviewPeriods {
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Year = 'Year',
}

export interface StatusesByThought {
  [thoughtId: string]: string[];
}

export interface Statuses {
  [statusId: string]: Status;
}

export interface Stats {
  created: number;
  started: number;
  completed: number;
  startedAndCompleted: number;
}

export interface Snapshot {
  new: number;
  completed: number;
  inProgress: number;
}
