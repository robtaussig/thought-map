export interface StatusItem {
  id: string;
  title: string;
  status: string;
  updated: number;
  thoughtId: string;
}

export interface DailyChunk {
  date: string;
  statusItems: StatusItem[];
}
