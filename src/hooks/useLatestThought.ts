import { useTypedSelector } from '../reducers';
import { thoughtSelector } from '../reducers/thoughts';

export const useLatestThought = () => {
  const thoughts = useTypedSelector(thoughtSelector);
  return thoughts[0];
};
