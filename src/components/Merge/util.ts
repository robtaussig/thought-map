import {
  Doc,
  Dump,
  DiffMap,
  DiffPair,
  Visited,
  Item,
  Comparable,
  MergeResults,
} from './types';
import { Deletion } from '../../store/rxdb/schemas/deletion';
import { COLLECTIONS_TO_IGNORE } from './CurrentCompare/constants';

export const merge = (left: Dump, right: Dump): MergeResults => {
  const leftMap: DiffMap = {};
  const rightMap: DiffMap = {};
  const diffPairs: DiffPair[] = [];
  const leftVisited: Visited = {};
  const leftDocMap: { [docId: string]: Doc } = {};
  const itemsToAdd: Item[] = [];
  const comparables: Comparable[] = [];
  const [uniqueLeftDeletions, uniqueRightDeletions]: [Deletion[], Deletion[]] = getDeletionSets(left, right);
  
  left.collections.filter(({ name }) => !COLLECTIONS_TO_IGNORE.includes(name)).forEach(collection => {
    leftVisited[collection.name] = new Set<string>();
    leftMap[collection.name] = {};
    collection.docs.forEach(doc => {
      leftVisited[collection.name].add(doc.id);
      leftMap[collection.name][doc.id] = doc.updated;
      leftDocMap[doc.id] = doc;
    });
  });

  right.collections.filter(({ name }) => !COLLECTIONS_TO_IGNORE.includes(name)).forEach(collection => {
    rightMap[collection.name] = {};
    collection.docs.forEach(doc => {
      if (leftVisited[collection.name].has(doc.id)) {
        leftVisited[collection.name].delete(doc.id);
        if (leftMap[collection.name][doc.id] !== doc.updated) {
          diffPairs.push({
            collectionName: collection.name,
            left: leftDocMap[doc.id],
            right: doc,
          });
        }
      } else {
        diffPairs.push({
          collectionName: collection.name,
          left: null,
          right: doc,
        });
      }
    });
  });

  Object.entries(leftVisited).forEach(([collectionName, visited]) => {
    visited.forEach(docId => {
      diffPairs.push({
        collectionName,
        left: leftDocMap[docId],
        right: null,
      });
    });
  });

  diffPairs.forEach(diffPair => {
    if (!diffPair.left) {
      itemsToAdd.push({
        collectionName: diffPair.collectionName,
        item: diffPair.right,
      });
    } else if (diffPair.right) {
      comparables.push([
        {
          collectionName: diffPair.collectionName,
          item: diffPair.left,
        },
        {
          collectionName: diffPair.collectionName,
          item: diffPair.right,
        }
      ]);
    }
  });
  
  return {
    itemsToAdd,
    comparables,
    removables: {
      left: uniqueLeftDeletions,
      right: uniqueRightDeletions,
    },
  };
};

export const getBackupIdFromHistory = (history: any): string => {
  const backupIdRegex = /\/(merge|process-merge)\/(.*)/.exec(history.location.pathname);
  if (backupIdRegex && backupIdRegex[2]) return backupIdRegex[2];

  return null;
};

const getDeletionSets = (left: Dump, right: Dump): [Deletion[], Deletion[]] => {
  //CONTINUE
  return [[], []];
}
