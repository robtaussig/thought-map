import { RxDatabase } from 'rxdb';
import { Picture } from 'store/rxdb/schemas/picture';
import Base from './base';

export const TABLE_NAME = 'picture';

export default class Pictures extends Base {
    static fetchAll = (db: RxDatabase): Promise<Picture[]> => Base.fetchAll(db, TABLE_NAME);
    static fetch = (db: RxDatabase, id: string): Promise<Picture> => Base.fetch(db, id, TABLE_NAME);
    static add = (db: RxDatabase, object: Picture): Promise<Picture> => Base.add(db, object, TABLE_NAME);
    static update = (db: RxDatabase, object: Picture): Promise<Picture> => Base.update(db, object, TABLE_NAME);
    static delete = (db: RxDatabase, id: string): Promise<any> => Base.delete(db, id, TABLE_NAME);
}
