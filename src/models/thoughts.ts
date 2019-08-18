import { RxDatabase } from 'rxdb';
import { Thought } from 'store/rxdb/schemas/thought';
import Base from './base';
import { TABLE_NAME as noteTableName } from './notes';
import { TABLE_NAME as tagTableName } from './tags';
import { TABLE_NAME as connectionTableName } from './connections';

const TABLE_NAME = 'thought';

export default class Thoughts extends Base {
  static props = {
    id: Number,
    planId: Number,
    title: String,
    type: String,
    status: String,
    description: String,
    created: Number,
    updated: Number,
    deleted: Number,
  }
  static fetchAll = (db: RxDatabase) => Base.fetchAll(db, TABLE_NAME)
  static fetch = (db: RxDatabase, id: string) => Base.fetch(db, id, TABLE_NAME)
  static add = (db: RxDatabase, object: Thought) => Base.add(db, object, TABLE_NAME)
  static update = (db: RxDatabase, object: Thought) => Base.update(db, object, TABLE_NAME)
  static delete = async (db: RxDatabase, id: string) => {
    await Base.deleteAssociations(db, [
      { tableName: noteTableName, key: 'thoughtId' },
      { tableName: tagTableName, key: 'thoughtId' },
      { tableName: connectionTableName, key: 'from' },
      { tableName: connectionTableName, key: 'to' },
    ], id);

    return Base.delete(db, TABLE_NAME, id);
  }
}
