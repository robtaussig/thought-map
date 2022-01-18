import React, { useEffect, useState } from 'react';
import { Node } from './types';
import { useSelector } from 'react-redux';
import { thoughtSelector } from '../../reducers/thoughts';
import { connectionSelector } from '../../reducers/connections';
import { wrap } from 'comlink';
import { Thought } from '../../store/rxdb/schemas/thought';
import { Connection } from '../../store/rxdb/schemas/connection';
import ThoughtMap from './thoughtMap';

const ThoughtMapper = wrap<ThoughtMap>(
  new Worker('./worker.ts')
);
//@ts-ignore
const instance: ThoughtMap = new ThoughtMapper();

const visited: {
  [thoughtId: string]: boolean
} = {};

const visitAndGetId = (thought: Thought) => {
  visited[thought.id] = true;
  return thought.id;
};

const visitAndGetFromTo = (connection: Connection): [string, string] => {
  visited[connection.id] = true;
  return [connection.from, connection.to];
};

const hasNotVisited = (object: (Thought | Connection)) => !visited[object.id];

export const getInstance = async () => {
  return instance;
};

export const useThoughtMap = (thoughtId: string) => {
  const [tree, setTree] = useState<{
    tree: Node[],
    descendants: string[],
  }>({
    tree: [],
    descendants: [],
  });

  const thoughts = useSelector(thoughtSelector);
  const connections = useSelector(connectionSelector);
  
  const updateState = async () => {
    const thoughtMap = await getInstance();
    const tree = await thoughtMap.generateThoughtMap(thoughtId);
    const descendants = await thoughtMap.getDescendents(thoughtId);
    setTree({ 
      tree,
      descendants: descendants.map(({ id }) => id),
    });
  };

  useEffect(() => {
    if (thoughtId) {
      const update = async () => {
        const newThoughtIds = thoughts
          .filter(hasNotVisited)
          .map(visitAndGetId);
  
        const thoughtMap = await getInstance();
        if (newThoughtIds.length > 0) {
          await thoughtMap.addThoughts(newThoughtIds);
        }
  
        updateState();
      };
  
      update();
    }
  }, [thoughts, thoughtId]);
  
  useEffect(() => {
    if (thoughtId) {
      const update = async () => {
  
        const newConnectionIds = Object.values(connections)
          .filter(hasNotVisited)
          .map(visitAndGetFromTo);
  
        const thoughtMap = await getInstance();
  
        if (newConnectionIds.length > 0) {
          await thoughtMap.addConnections(newConnectionIds);
        }
        updateState();
      };
  
      update();
    }
  }, [connections, thoughtId]);

  return tree;
};

export default useThoughtMap;
