import { useContext } from 'react';
import { Context } from '../store';

export const useApp = () => {
  const { history, dispatch } = useContext(Context);

  return { history, dispatch };
};

export default useApp;
