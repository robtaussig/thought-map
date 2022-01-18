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
    const leftIsLater = left.item.updated > right.item.updated;

    const merged: Item = {
        collectionName: left.collectionName,
        item: Object.entries(left.item).reduce((next, [field, value]) => {
            if (fieldsToPick.includes(field)) {
                next[field] = leftIsLater ? value : right.item[field];
            } else if (field !== 'updated') {
                next[field] = value;
            }
  
            return next;
        }, { id: left.item.id, updated: right.item.updated } as Doc)
    };

    return merged;
};
