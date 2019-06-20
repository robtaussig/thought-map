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
  static fetchAll = db => Base.fetchAll(db, TABLE_NAME)
  static fetch = (db, id) => Base.fetch(db, TABLE_NAME, id)
  static add = (db, object) => Base.add(db, TABLE_NAME, object)
  static update = (db, object) => Base.update(db, TABLE_NAME, object)
  static delete = async (db, id) => {
    await Base.deleteAssociations(db, [
      { tableName: noteTableName, key: 'thoughtId' },
      { tableName: tagTableName, key: 'thoughtId' },
      { tableName: connectionTableName, key: 'from' },
      { tableName: connectionTableName, key: 'to' },
    ], id);

    return Base.delete(db, TABLE_NAME, id);
  }
}
