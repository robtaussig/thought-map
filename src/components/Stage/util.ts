import { Thought } from '../../store/rxdb/schemas/thought';

export const getInitialData = (active: Thought[], backlog: Thought[]): {
  columns: {
    [colId: string]: {
      id: string;
      title: string;
      items: Thought[];
    }
  },
  columnOrder: ['active', 'backlog'];
} => {
  return {
    columns: {
      active: {
        id: 'active',
        title: 'Active',
        items: active,
      },
      backlog: {
        id: 'backlog',
        title: 'Backlog',
        items: backlog,
      },
    },
    columnOrder: ['active', 'backlog'],
  };
};

export const reorderList = <T extends any[]>(list: T, startIndex: number, endIndex: number): T => {
  const result = Array.from(list) as T;
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
