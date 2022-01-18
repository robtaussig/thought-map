import {
  Comparable,
  DiffMap,
  DiffPair,
  Doc,
  Dump,
  Item,
  MergeResults,
  Removable,
  Visited,
} from './types';
import { Deletion } from '../../store/rxdb/schemas/deletion';
import { COLLECTIONS_TO_IGNORE } from './CurrentCompare/constants';
import { useLocation } from 'react-router-dom';

export const merge = (left: Dump, right: Dump): MergeResults => {
  const leftMap: DiffMap = {};
  const diffPairs: DiffPair[] = [];
  const leftVisited: Visited = {};
  const leftDocs: { [docId: string]: Doc } = {};
  const rightDocs: { [docId: string]: Doc } = {};
  const leftDocMap: { [docId: string]: Doc } = {};
  const itemsToAdd: Item[] = [];
  const comparables: Comparable[] = [];
  const [leftDeletions, uniqueRightDeletions]: [Deletion[], Deletion[]] =
    getDeletionSets(left, right);
  
  left.collections
    .filter(({ name }) => !COLLECTIONS_TO_IGNORE.includes(name))
    .forEach(collection => {
      leftVisited[collection.name] = new Set<string>();
      leftMap[collection.name] = {};
      collection.docs.forEach(doc => {
        leftDocs[doc.id] = doc;
        leftVisited[collection.name].add(doc.id);
        leftMap[collection.name][doc.id] = doc.updated;
        leftDocMap[doc.id] = doc;
      });
    });

  right.collections
    .filter(({ name }) => !COLLECTIONS_TO_IGNORE.includes(name))
    .forEach(collection => {
      collection.docs.forEach(doc => {
        rightDocs[doc.id] = doc;
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

  Object.entries(leftVisited)
    .forEach(([collectionName, visited]) => {
      visited.forEach(docId => {
        diffPairs.push({
          collectionName,
          left: leftDocMap[docId],
          right: null,
        });
      });
    });

  diffPairs
    .forEach(diffPair => {
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
    itemsToAdd: filterItemsToAdd(itemsToAdd, leftDeletions),
    itemsToRemove: [],
    deletionsToAdd: [],
    comparables,
    removables: filterDeletionsAndConvertToRemovable(uniqueRightDeletions, leftDocs),
  };
};

const filterItemsToAdd = (
  items: Item[],
  deletions: Deletion[],
): Item[] => {
  const deletionsSet = new Set(deletions.map(({ itemId }) => itemId));
  return items.filter(({ item }) => deletionsSet.has(item.id) === false);
};

const filterDeletionsAndConvertToRemovable = (
  deletions: Deletion[],
  otherSideDocs: { [docId: string]: Doc },
): Removable[] => {
  return deletions
    .filter(({ itemId }) => otherSideDocs[itemId])
    .map(deletion => [deletion, otherSideDocs[deletion.itemId]]);
};

export const useBackupIdFromHistory = (): string => {
  const location = useLocation();
  const backupIdRegex = /\/(merge|process-merge)\/(.*)/.exec(location.pathname);
  if (backupIdRegex && backupIdRegex[2]) return backupIdRegex[2];

  return null;
};

const getDeletionSets = (left: Dump, right: Dump): [Deletion[], Deletion[]] => {
  const leftDeletionDocs = left.collections
    .find(({ name }) => name === 'deletion')
    ?.docs as Deletion[];

  const rightDeletionDocs = right.collections
    .find(({ name }) => name === 'deletion')
    ?.docs as Deletion[];

  if (!rightDeletionDocs && leftDeletionDocs) return [leftDeletionDocs, []];
  if (!leftDeletionDocs && rightDeletionDocs) return [[], rightDeletionDocs];
  if (!leftDeletionDocs && !rightDeletionDocs) return [[], []];

  const leftDeletionItemIds = new Set<string>(leftDeletionDocs.map(({ itemId }) => itemId));
  const rightDeletionItemIds = new Set<string>(rightDeletionDocs.map(({ itemId }) => itemId));

  //Create clone so as to not delete from source object while iterating
  [...leftDeletionItemIds].forEach(itemId => {
    if (rightDeletionItemIds.has(itemId)) {
      rightDeletionItemIds.delete(itemId);
    }
  });

  return [
    leftDeletionDocs.filter(({ itemId }) => leftDeletionItemIds.has(itemId)),
    rightDeletionDocs.filter(({ itemId }) => rightDeletionItemIds.has(itemId)),
  ];
};
