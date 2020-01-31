import { RxDatabase } from 'rxdb';
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

export const merge = async (db: RxDatabase, right: Dump): Promise<MergeResults> => {
  const left: Dump = await db.dump();

  const leftMap: DiffMap = {};
  const rightMap: DiffMap = {};
  const diffPairs: DiffPair[] = [];
  const leftVisited: Visited = {};
  const leftDocMap: { [docId: string]: Doc } = {};
  const itemsToAdd: Item[] = [];
  const comparables: Comparable[] = [];
  
  left.collections.forEach(collection => {
    leftVisited[collection.name] = new Set<string>();
    leftMap[collection.name] = {};
    collection.docs.forEach(doc => {
      leftVisited[collection.name].add(doc.id);
      leftMap[collection.name][doc.id] = doc.updated;
      leftDocMap[doc.id] = doc;
    });
  });

  right.collections.forEach(collection => {
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
    } else if (!diffPair.right) {
      itemsToAdd.push({
        collectionName: diffPair.collectionName,
        item: diffPair.left,
      });
    } else {
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
  };
};