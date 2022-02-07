import { useTypedSelector } from '../reducers';
import { thoughtSelector } from '../reducers/thoughts';

export const useLatestThought = () => {
  const thoughts = useTypedSelector(thoughtSelector.selectAll);
  return thoughts[0];
};
