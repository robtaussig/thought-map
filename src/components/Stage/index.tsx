import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { stageSelector } from '../../reducers/stage';
import { thoughtSelector } from '../../reducers/thoughts';
import { intoMap } from '../../lib/util';
import Wrapper from './Wrapper';

interface StageProps {

}

export const Stage: FC<StageProps> = () => {
  const stage = useSelector(stageSelector);
  const thoughts = useSelector(thoughtSelector);

  const [activeThoughts, backlogThoughts] = useMemo(() => {
    if (thoughts?.length > 0) {
      const thoughtsById = intoMap(thoughts);
      return [
        stage.current.map(id => thoughtsById[id]),
        stage.backlog.map(id => thoughtsById[id]),
      ];
    } else {
      return [];
    }
  }, [stage, thoughts]);

  if (!activeThoughts || !backlogThoughts) {
    return null;
  }

  return (
    <Wrapper
      activeThoughts={activeThoughts}
      backlogThoughts={backlogThoughts}
    />
  );
};

export default Stage;
