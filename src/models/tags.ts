import { RxDatabase } from 'rxdb';
import { Tag } from 'store/rxdb/schemas/tag';
import Base from './base';

export const TABLE_NAME = 'tag';

export default class Tags extends Base {
    static fetchAll = (db: RxDatabase): Promise<Tag[]> => Base.fetchAll(db, TABLE_NAME);
    static fetch = (db: RxDatabase, id: string): Promise<Tag> => Base.fetch(db, id, TABLE_NAME);
    static add = (db: RxDatabase, object: Tag): Promise<Tag> => Base.add(db, object, TABLE_NAME);
    static update = (db: RxDatabase, object: Tag): Promise<Tag> => Base.update(db, object, TABLE_NAME);
    static delete = (db: RxDatabase, id: string): Promise<any> => Base.delete(db, id, TABLE_NAME);
}
