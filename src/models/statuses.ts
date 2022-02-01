import { v4 as uuidv4 } from 'uuid';
import { RxDatabase } from 'rxdb';
import { Status } from 'store/rxdb/schemas/status';
import Base from './base';
import Thoughts from './thoughts';

export const TABLE_NAME = 'status';

export default class Statuses extends Base {
  static fetchAll = (db: RxDatabase): Promise<Status[]> => Base.fetchAll(db, TABLE_NAME);
  static fetch = (db: RxDatabase, id: string): Promise<Status> => Base.fetch(db, id, TABLE_NAME);
  static add = async (db: RxDatabase, object: Status): Promise<Status> => {
    const timestamp = +new Date();

    const thought = await Thoughts.fetch(db, object.thoughtId);
    const [result] = await Promise.all([db[TABLE_NAME].insert(Object.assign({}, object, {
      id: uuidv4(),
      created: object.created || timestamp,
      updated: object.updated || timestamp,
    })), Thoughts.update(db, {
      ...thought,
      status: object.text,
      updated: timestamp,
    })]);

    return result.toJSON();
  };
  static update = (db: RxDatabase, object: Status): Promise<Status> => Base.update(db, object, TABLE_NAME);
  static delete = (db: RxDatabase, id: string): Promise<any> => Base.delete(db, id, TABLE_NAME);
}
