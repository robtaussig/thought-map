import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { stageSelector } from '../../reducers/stage';
import { thoughtSelector } from '../../reducers/thoughts';
import { intoMap } from '../../lib/util';
import Wrapper from './Wrapper';
import { Thought } from '../../store/rxdb/schemas/types';

interface StageProps {

}

const sortThoughtsWithIndex = (thoughts: Thought[]): Thought[] => {
  const thoughtsWithIndexes = thoughts.filter(({ stageIndex }) => stageIndex > 0)
    .sort((a, b) => {
      if (a.stageIndex < b.stageIndex) {
        return -1;
      }
      return 1;
    });
  const thoughtsWithoutIndexes = thoughts.filter(({ stageIndex }) => stageIndex === 0);

  thoughtsWithIndexes.forEach(thought => {
    thoughtsWithoutIndexes.splice(thought.stageIndex - 1, 0, thought);
  });

  return thoughtsWithoutIndexes;
};

export const Stage: FC<StageProps> = () => {
  const stage = useSelector(stageSelector);
  const thoughts = useSelector(thoughtSelector);

  const [activeThoughts, backlogThoughts] = useMemo(() => {
    if (thoughts?.length > 0) {
      const thoughtsById = intoMap(thoughts);
      return [
        sortThoughtsWithIndex(stage.current.map(id => thoughtsById[id])),
        sortThoughtsWithIndex(stage.backlog.map(id => thoughtsById[id])),
      ];
    } else {
      return [];
    }
  }, [stage, thoughts]);

  if (!activeThoughts || !backlogThoughts) {
    return <div style={{ height: '100%' }}/>;
  }

  return (
    <Wrapper
      activeThoughts={activeThoughts}
      backlogThoughts={backlogThoughts}
    />
  );
};

export default Stage;
