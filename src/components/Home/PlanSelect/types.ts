import { Status } from '../../../store/rxdb/schemas/Status';
import { Plan } from '../../../store/rxdb/schemas/plan';
import { Thought } from '../../../store/rxdb/schemas/Thought';

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

export interface ReviewProps {
  classes: any;
  plan: Plan;
  thoughts: Thought[];
  reviewPeriod: ReviewPeriods;
  statusesByThought: StatusesByThought;
  statuses: Statuses;
}