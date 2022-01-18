export type Group = StatusUpdate[];

export interface StatusUpdate {
  thoughtId: string;
  statusId: string;
  status: string;
  completionIndex: [number, number];
  thoughtIndex?: [number, number];
  statusUpdateIndex?: [number, number];
  thoughtTitle: string;
  location: string;
  created: number;
  isSelectedThought: boolean;
}
