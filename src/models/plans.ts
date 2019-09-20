import { RxDatabase } from 'rxdb';
import { Plan } from 'store/rxdb/schemas/plan';
import Base from './base';

export const TABLE_NAME = 'plan';

export default class Plans extends Base {
  static fetchAll = (db: RxDatabase): Promise<Plan[]> => Base.fetchAll(db, TABLE_NAME)
  static fetch = (db: RxDatabase, id: string): Promise<Plan> => Base.fetch(db, id, TABLE_NAME)
  static add = (db: RxDatabase, object: Plan): Promise<Plan> => Base.add(db, object, TABLE_NAME)
  static update = (db: RxDatabase, object: Plan): Promise<Plan> => Base.update(db, object, TABLE_NAME)
  static delete = (db: RxDatabase, id: string): Promise<any> => Base.delete(db, id, TABLE_NAME)
}
