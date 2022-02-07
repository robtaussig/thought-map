import React, { FC } from 'react';
import { useIdFromUrl } from '../../lib/util';
import ConnectionGraph from './components/ConnectionGraph';
import { useSelector } from 'react-redux';
import { thoughtSelector } from '../../reducers/thoughts';
import { connectionSelector } from '../../reducers/connections';
import { useTypedSelector } from '../../reducers';

interface ConnectionsProps {
  statusOptions: string[];
}

export const Connections: FC<ConnectionsProps> = ({ statusOptions }) => {
  const connections = useSelector(connectionSelector);

  const thoughtId = useIdFromUrl('thought') as string;
  const thoughts = useTypedSelector(thoughtSelector.selectAll);
  const thought = useTypedSelector(state => thoughtSelector.selectById(state, thoughtId));

  return (
    <ConnectionGraph thought={thought} thoughts={thoughts} connections={connections} statusOptions={statusOptions}/>
  );
};

export default Connections;
