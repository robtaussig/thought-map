import { Connection } from '../../../store/rxdb/schemas/connection';
import { Thought } from '../../../store/rxdb/schemas/thought';
import { Status } from '../../../store/rxdb/schemas/status';
import { Item } from '../types';

interface ConnectionsByThought {
  [thoughtId: string]: string[];
}

interface Thoughts {
  [thoughtId: string]: Thought;
}

interface Statuses {
  [thoughtId: string]: Status[]
}

export const processItemsToAdd = (
    itemsToAdd: Item[],
    thoughts: Thought[],
    connections: { [connectionId: string]: Connection },
): Item[] => {
    const connectionsByThoughtId = Object.values(connections)
        .reduce((next, { from, to }) => {
            next[from] = next[from] || [];
            next[from].push(to);

            return next;
        }, {} as ConnectionsByThought);

    const thoughtsById = thoughts.reduce((next, thought) => {
        next[thought.id] = thought;

        return next;
    }, {} as Thoughts);

    const thoughtsToAddById: Thoughts = {};

    itemsToAdd.forEach(({ collectionName, item }) => {
        if (collectionName === 'thought') {
            thoughtsToAddById[item.id] = item as Thought;
        }
    });

    return itemsToAdd
        .filter(filterThoughtlessItems(
            thoughtsById,
            thoughtsToAddById,
        ))
        .filter(filterRedundantStatuses(
            thoughtsById,
            thoughtsToAddById,
        ))
        .filter(filterRedundantConnections(
            connectionsByThoughtId,
            thoughtsById,
            thoughtsToAddById,
        ));
};

const filterRedundantStatuses = (
    thoughtsById: Thoughts,
    thoughtsToAddById: Thoughts,
) => ({ collectionName, item }: Item): boolean => {
    //Ignore non-statuses
    if (collectionName !== 'status') return true;

    const { thoughtId, text } = item;
    const thought = thoughtsToAddById[thoughtId] ?? thoughtsById[thoughtId];
    const existingThought = thoughtsById[thoughtId];

    //Adding thought that does not already exist
    if (thought && !existingThought) return true;

    //Status was updated and this matches status text
    if (thought.status !== existingThought.status && thought.status === text) return true;

    return false;
};

const filterRedundantConnections = (
    connectionsByThoughtId: ConnectionsByThought,
    thoughtsById: Thoughts,
    thoughtsToAddById: Thoughts,
) => ({ collectionName, item }: Item): boolean => {
    //Ignore non-connections
    if (collectionName !== 'connection') return true;

    const { from, to } = item;

    //Either to or from connection will not exist
    if (
        (!thoughtsById[from] && !thoughtsToAddById[from]) ||
    (!thoughtsById[to] && !thoughtsToAddById[to])
    ) {
        return false;
    }

    //Functionally identical connection already exists or this will create immediate cycle
    if (
        connectionsByThoughtId[from]?.includes(to) ||
    connectionsByThoughtId[to]?.includes(from)
    ) {
        return false;
    }
  
    return true;
};

const filterThoughtlessItems = (
    thoughtsById: Thoughts,
    thoughtsToAddById: Thoughts,
) => ({ collectionName, item }: Item): boolean => {
    if (!item.thoughtId) return true;

    return Boolean(thoughtsById[item.thoughtId] || thoughtsToAddById[item.thoughtId]);
};
