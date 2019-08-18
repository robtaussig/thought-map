import { RxDatabase } from 'rxdb';
import { Note } from 'store/rxdb/schemas/note';
import Base from './base';

export const TABLE_NAME = 'note';

export default class Notes extends Base {
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
  static add = (db: RxDatabase, object: Note) => Base.add(db, object, TABLE_NAME)
  static update = (db: RxDatabase, object: Note) => Base.update(db, object, TABLE_NAME)
  static delete = (db: RxDatabase, id: string) => Base.delete(db, id, TABLE_NAME)
}
