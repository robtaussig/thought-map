import { RxDatabase } from 'rxdb';
import { Status } from 'store/rxdb/schemas/status';
import Base from './base';

export const TABLE_NAME = 'status';

export default class Statuses extends Base {
  static props = {
    id: Number,
    thoughtId: Number,
    text: String,
    created: Number,
    updated: Number,
    deleted: Number,
  }
  static fetchAll = (db: RxDatabase): Promise<Status[]> => Base.fetchAll(db, TABLE_NAME)
  static fetch = (db: RxDatabase, id: string): Promise<Status> => Base.fetch(db, id, TABLE_NAME)
  static add = (db: RxDatabase, object: Status): Promise<Status> => Base.add(db, object, TABLE_NAME)
  static update = (db: RxDatabase, object: Status): Promise<Status> => Base.update(db, object, TABLE_NAME)
  static delete = (db: RxDatabase, id: string): Promise<any> => Base.delete(db, id, TABLE_NAME)
}
