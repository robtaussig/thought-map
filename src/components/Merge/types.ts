import { Deletion } from '../../store/rxdb/schemas/deletion';

export interface CurrentItem {
  compareIndex: number;
  reviewIndex: number;
  removableIndex: number;
}

export interface Doc {
  id: string;
  updated: number;
  [field: string]: any;
}

export interface Collection {
  name: string;
  docs: Doc[];
}

export interface Dump {
  collections: Collection[];
}

export interface DocMap {
  [docId: string]: number;
}

export interface DiffMap {
  [collectionName: string]: DocMap;
}

//If left is null, then right exists without left. If right is null, left exists without right. If both exist, then conflict.
export interface DiffPair {
  collectionName: string;
  left: Doc;
  right: Doc;
}

export interface Visited {
  [collectionName: string]: Set<string>;
}

export interface Item {
  collectionName: string;
  item: Doc;
}

export type Comparable = [Item, Item];

export type Removable = [Deletion, Doc];

export interface MergeResults {
  itemsToAdd: Item[];
  deletionsToAdd: Deletion[];
  itemsToRemove: Item[];
  comparables: Comparable[];
  removables:  Removable[];
}
