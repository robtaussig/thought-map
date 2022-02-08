import { RxDatabase } from 'rxdb';
import { Participant } from 'store/rxdb/schemas/participant';
import Base from './base';

export const TABLE_NAME = 'participant';

export default class Participants extends Base {
  static fetchAll = (db: RxDatabase): Promise<Participant[]> => Base.fetchAll(db, TABLE_NAME);
  static fetch = (db: RxDatabase, id: string): Promise<Participant> => Base.fetch(db, id, TABLE_NAME);
  static add = (db: RxDatabase, object: Participant): Promise<Participant> => Base.add(db, object, TABLE_NAME);
  static update = (db: RxDatabase, object: Participant): Promise<Participant> => Base.update(db, object, TABLE_NAME);
  static delete = (db: RxDatabase, id: string): Promise<any> => Base.delete(db, id, TABLE_NAME);
}
