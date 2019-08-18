import { RxDatabase } from 'rxdb';
import { Plan } from 'store/rxdb/schemas/plan';
import Base from './base';

export const TABLE_NAME = 'plan';

export default class Plans extends Base {
  static props = {
    id: Number,
    name: String,
    created: Number,
    updated: Number,
    deleted: Number,
  }
  static fetchAll = (db: RxDatabase) => Base.fetchAll(db, TABLE_NAME)
  static fetch = (db: RxDatabase, id: string) => Base.fetch(db, id, TABLE_NAME)
  static add = (db: RxDatabase, object: Plan) => Base.add(db, object, TABLE_NAME)
  static update = (db: RxDatabase, object: Plan) => Base.update(db, object, TABLE_NAME)
  static delete = (db: RxDatabase, id: string) => Base.delete(db, id, TABLE_NAME)
}
