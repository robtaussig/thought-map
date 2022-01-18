import { RxDatabase } from 'rxdb';
import { Deletion } from 'store/rxdb/schemas/deletion';
import Base from './base';

export const TABLE_NAME = 'deletion';

export default class Deletions extends Base {
  static fetchAll = (db: RxDatabase): Promise<Deletion[]> => Base.fetchAll(db, TABLE_NAME);
  static fetch = (db: RxDatabase, id: string): Promise<Deletion> => Base.fetch(db, id, TABLE_NAME);
  static add = (db: RxDatabase, object: Deletion): Promise<Deletion> => Base.add(db, object, TABLE_NAME);
  static update = (db: RxDatabase, object: Deletion): Promise<Deletion> => Base.update(db, object, TABLE_NAME);
  static delete = (db: RxDatabase, id: string): Promise<any> => Base.delete(db, id, TABLE_NAME);
}
