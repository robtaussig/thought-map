import { createNestedReducer } from '../../../hooks/useNestedReducer';

export const DEFAULT_STATE = {
  title: '',
  typeOptions: ['Task', 'Todo', 'Reminder', 'Misc'],
  type: 'Task',
  date: '',
  description: '',
  notes: [''],
};

export const createdThoughtReducer = createNestedReducer();
