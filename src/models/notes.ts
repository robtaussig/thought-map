import { RxDatabase } from 'rxdb';
import { Note } from 'store/rxdb/schemas/note';
import Base from './base';

export const TABLE_NAME = 'note';

export default class Notes extends Base {
  static fetchAll = (db: RxDatabase): Promise<Note[]> => Base.fetchAll(db, TABLE_NAME)
  static fetch = (db: RxDatabase, id: string): Promise<Note> => Base.fetch(db, id, TABLE_NAME)
  static add = (db: RxDatabase, object: Note): Promise<Note> => Base.add(db, object, TABLE_NAME)
  static update = (db: RxDatabase, object: Note): Promise<Note> => Base.update(db, object, TABLE_NAME)
  static delete = (db: RxDatabase, id: string): Promise<any> => Base.delete(db, id, TABLE_NAME)
}
