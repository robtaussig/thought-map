import React, { FC, useMemo } from 'react';
import { AppState } from '../../reducers';
import useApp from '../../hooks/useApp';
import { getIdFromUrl } from '../../lib/util';
import ConnectionGraph from './components/ConnectionGraph';

interface ConnectionsProps {
  state: AppState;
}

export const Connections: FC<ConnectionsProps> = ({ state }) => {
  const { history } = useApp();

  const thoughtId = getIdFromUrl(history, 'thought');
  const thought = useMemo(() => state.thoughts.find(thought => thought.id === thoughtId), [thoughtId, state.thoughts]);

  return (
    <ConnectionGraph thought={thought} thoughts={state.thoughts} connections={state.connections}/>
  );
};

export default Connections;
