import { RxDatabase } from 'rxdb';
import { Thought } from 'store/rxdb/schemas/thought';
import Base from './base';
import { TABLE_NAME as noteTableName } from './notes';
import { TABLE_NAME as tagTableName } from './tags';
import { TABLE_NAME as pictureName } from './pictures';
import { TABLE_NAME as connectionTableName } from './connections';
import { TABLE_NAME as statusTableName } from './statuses';

export const TABLE_NAME = 'thought';

export default class Thoughts extends Base {
  static fetchAll = (db: RxDatabase): Promise<Thought[]> => Base.fetchAll(db, TABLE_NAME)
  static fetch = (db: RxDatabase, id: string): Promise<Thought> => Base.fetch(db, id, TABLE_NAME)
  static add = (db: RxDatabase, object: Thought): Promise<Thought> => Base.add(db, object, TABLE_NAME)
  static update = (db: RxDatabase, object: Thought): Promise<Thought> => Base.update(db, object, TABLE_NAME)
  static delete = async (db: RxDatabase, id: string) => {
    await Base.deleteAssociations(db, [
      { tableName: noteTableName, key: 'thoughtId' },
      { tableName: tagTableName, key: 'thoughtId' },
      { tableName: connectionTableName, key: 'from' },
      { tableName: connectionTableName, key: 'to' },
      { tableName: pictureName, key: 'thoughtId' },
      { tableName: statusTableName, key: 'thoughtId' },
    ], id);

    return Base.delete(db, id, TABLE_NAME);
  }
}
