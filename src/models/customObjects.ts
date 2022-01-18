import { RxDatabase } from 'rxdb';
import { CustomObject } from 'store/rxdb/schemas/customObject';
import Base from './base';

export const TABLE_NAME = 'custom_object';

export default class CustomObjects extends Base {
    static fetchAll = (db: RxDatabase): Promise<CustomObject[]> => Base.fetchAll(db, TABLE_NAME);
    static fetch = (db: RxDatabase, id: string): Promise<CustomObject> => Base.fetch(db, id, TABLE_NAME);
    static add = (db: RxDatabase, object: CustomObject): Promise<CustomObject> => Base.add(db, object, TABLE_NAME);
    static update = (db: RxDatabase, object: CustomObject): Promise<CustomObject> => Base.update(db, object, TABLE_NAME);
    static delete = (db: RxDatabase, id: string): Promise<any> => Base.delete(db, id, TABLE_NAME);
}
