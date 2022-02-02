import { createContext } from 'react';

export const StageContext = createContext<(thoughtId: string) => void>(() => null);
