import { useEffect, useState } from 'react';
import { Node } from './types';
import { useSelector } from 'react-redux';
import { thoughtSelector } from '../../reducers/thoughts';
import { connectionSelector } from '../../reducers/connections';
import { wrap } from 'comlink';
import { Thought } from '../../store/rxdb/schemas/thought';
import { Connection } from '../../store/rxdb/schemas/connection';
import ThoughtMap from './thoughtMap';

const ThoughtMapper = wrap<typeof ThoughtMap>(new Worker('./worker.ts'));
const instance = new ThoughtMapper();

const visited: {
  [thoughtId: string]: boolean;
} = {};

const visitAndGetId = (thought: Thought) => {
  visited[thought.id] = true;
  return thought.id;
};

const visitAndGetFromTo = (connection: Connection): [string, string] => {
  visited[connection.id] = true;
  return [connection.from, connection.to];
};

const hasNotVisited = (object: Thought | Connection) => !visited[object.id];

export const getInstance = async () => {
  return instance;
};

export const useThoughtMap = (thoughtId: string) => {
  const [tree, setTree] = useState<{
    tree: Node[];
    descendants: string[];
  }>({
    tree: [],
    descendants: [],
  });

  const thoughts = useSelector(thoughtSelector);
  const connections = useSelector(connectionSelector);

  useEffect(() => {
    if (thoughtId) {
      const update = async () => {
        const newThoughtIds = thoughts
          .filter(hasNotVisited)
          .map(visitAndGetId);

        const newConnectionIds = Object.values(connections)
          .filter(hasNotVisited)
          .map(visitAndGetFromTo);

        const thoughtMap = await getInstance();
        if (newThoughtIds.length > 0) {
          await thoughtMap.addThoughts(newThoughtIds);
        }
        if (newConnectionIds.length > 0) {
          await thoughtMap.addConnections(newConnectionIds);
        }

        const tree = await thoughtMap.generateThoughtMap(thoughtId);
        const descendants = await thoughtMap.getDescendents(thoughtId);
        setTree({
          tree,
          descendants: descendants.map(({ id }) => id),
        });
      };

      update();
    }
  }, [thoughts, connections, thoughtId]);

  return tree;
};

export default useThoughtMap;
