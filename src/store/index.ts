import { createContext, Dispatch } from 'react';
import { History } from 'history';

type Action = {
  type: any,
  payload: any,
}

interface AppContext {
  history?: History;
  dispatch?: Dispatch<Action>;
}

export const Context = createContext<AppContext>({});
