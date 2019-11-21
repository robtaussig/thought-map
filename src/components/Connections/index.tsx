import React, { FC, useMemo } from 'react';
import useApp from '../../hooks/useApp';
import { getIdFromUrl } from '../../lib/util';
import ConnectionGraph from './components/ConnectionGraph';
import { useSelector } from 'react-redux';
import { thoughtSelector } from '../../reducers/thoughts';
import { connectionSelector } from '../../reducers/connections';

interface ConnectionsProps {
  statusOptions: string[];
}

export const Connections: FC<ConnectionsProps> = ({ statusOptions }) => {
  const { history } = useApp();
  const thoughts = useSelector(thoughtSelector);
  const connections = useSelector(connectionSelector);

  const thoughtId = getIdFromUrl(history, 'thought');
  const thought = useMemo(() => thoughts.find(thought => thought.id === thoughtId), [thoughtId, thoughts]);

  return (
    <ConnectionGraph thought={thought} thoughts={thoughts} connections={connections} statusOptions={statusOptions}/>
  );
};

export default Connections;
