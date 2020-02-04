import { Item, Doc } from '../types';

export const generateFieldsToPick = (left: Doc, right: Doc): string[] => {
  const diffs: string[] = [];
  Object.entries(left).forEach(([field, value]) => {
    if (field !== 'updated' && right[field] !== value) {
      diffs.push(field);
    }
  });

  Object.entries(right).forEach(([field, value]) => {
    if (left.hasOwnProperty(field) === false) {
      diffs.push(field);
    }
  });

  return diffs;
};

export const generateIntersectItem = (left: Item, right: Item): Item => {
  const fieldsToPick = generateFieldsToPick(left.item, right.item);

  const merged: Item = {
    collectionName: left.collectionName,
    item: Object.entries(left.item).reduce((next, [field, value]) => {
      if (fieldsToPick.includes(field)) {
        next[field] = null;
      } else {
        next[field] = value;
      }
      return next;
    }, { id: left.item.id, updated: +new Date() } as Doc)
  };

  return merged;
};
