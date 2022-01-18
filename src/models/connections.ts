import { RxDatabase } from 'rxdb';
import { Connection } from 'store/rxdb/schemas/connection';
import Base from './base';

export const TABLE_NAME = 'connection';

export default class Connections extends Base {
  static fetchAll = (db: RxDatabase): Promise<Connection[]> => Base.fetchAll(db, TABLE_NAME);
  static fetch = (db: RxDatabase, id: string): Promise<Connection> => Base.fetch(db, id, TABLE_NAME);
  static add = (db: RxDatabase, object: Connection): Promise<Connection> => Base.add(db, object, TABLE_NAME);
  static update = (db: RxDatabase, object: Connection): Promise<Connection> => Base.update(db, object, TABLE_NAME);
  static delete = (db: RxDatabase, id: string): Promise<any> => Base.delete(db, id, TABLE_NAME);
}
