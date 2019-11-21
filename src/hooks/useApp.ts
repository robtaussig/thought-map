import { useContext } from 'react';
import { Context } from '../store';

export const useApp = () => {
  const { history } = useContext(Context);

  return { history };
};

export default useApp;
