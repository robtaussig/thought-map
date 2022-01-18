import { RxDatabase } from 'rxdb';
import { Backup } from 'store/rxdb/schemas/backup';
import Base from './base';

export const TABLE_NAME = 'doc_backup';

export default class Backups extends Base {
  static fetchAll = (db: RxDatabase): Promise<Backup[]> => Base.fetchAll(db, TABLE_NAME);
  static fetch = (db: RxDatabase, id: string): Promise<Backup> => Base.fetch(db, id, TABLE_NAME);
  static add = (db: RxDatabase, object: Backup): Promise<Backup> => Base.add(db, object, TABLE_NAME);
  static update = (db: RxDatabase, object: Backup): Promise<Backup> => Base.update(db, object, TABLE_NAME);
  static upsert = async (db: RxDatabase, object: Backup): Promise<Backup> => {
    const results = await Base.find(db, 'backupId', object.backupId, TABLE_NAME);
    if (results && results.length > 0) {
      return Backups.update(db, {
        ...results[0],
        ...object,
      });
    } else {
      return Backups.add(db, object);
    }
  };
  static delete = (db: RxDatabase, id: string): Promise<any> => Base.delete(db, id, TABLE_NAME);
}
