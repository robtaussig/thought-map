import { RxDatabase } from 'rxdb';
import { BulkList } from 'store/rxdb/schemas/bulkList';
import Base from './base';

export const TABLE_NAME = 'bulk_list';

export default class BulkLists extends Base {
  static fetchAll = (db: RxDatabase): Promise<BulkList[]> => Base.fetchAll(db, TABLE_NAME)
  static fetch = (db: RxDatabase, id: string): Promise<BulkList> => Base.fetch(db, id, TABLE_NAME)
  static add = (db: RxDatabase, object: BulkList): Promise<BulkList> => Base.add(db, object, TABLE_NAME)
  static update = (db: RxDatabase, object: BulkList): Promise<BulkList> => Base.update(db, object, TABLE_NAME)
  static delete = (db: RxDatabase, id: string): Promise<any> => Base.delete(db, id, TABLE_NAME)
}
