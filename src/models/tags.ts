import { RxDatabase } from 'rxdb';
import { Tag } from 'store/rxdb/schemas/tag';
import Base from './base';

export const TABLE_NAME = 'tag';

export default class Tags extends Base {
  static props = {
    id: Number,
    thoughtId: Number,
    text: String,
    index: Number,
    created: Number,
    updated: Number,
    deleted: Number,
  }
  static fetchAll = (db: RxDatabase) => Base.fetchAll(db, TABLE_NAME)
  static fetch = (db: RxDatabase, id: string) => Base.fetch(db, id, TABLE_NAME)
  static add = (db: RxDatabase, object: Tag) => Base.add(db, object, TABLE_NAME)
  static update = (db: RxDatabase, object: Tag) => Base.update(db, object, TABLE_NAME)
  static delete = (db: RxDatabase, id: string) => Base.delete(db, id, TABLE_NAME)
}
