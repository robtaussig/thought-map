import { v4 as uuidv4 } from 'uuid';
import { RxDatabase, RxDocument } from 'rxdb';
import { Deletion } from '../store/rxdb/schemas/deletion';

const toJSON = (res: RxDocument<any>) => res.toJSON();

interface Sortable {
  index?: number;
  updated?: number;
}

interface AssociationsToDelete {
  tableName: string;
  key: string;
}

export const sortByDateUpdated = (resLeft: Sortable, resRight: Sortable): number => {
  return resRight.updated > resLeft.updated ? 1 : -1;
};

export default class Base {
  static fetchAll = async (db: RxDatabase, tableName: string): Promise<any[]> => {
    const query = db[tableName].find();
    const results = await query.exec();
    return results
      .map(toJSON)
      .sort(sortByDateUpdated);
  };

  static fetch = async (db: RxDatabase, id: string, tableName: string): Promise<any> => {
    const query = db[tableName].find().where('id').eq(id);
    const result: RxDocument<any> = await query.exec();

    return result && result[0] ? result[0].toJSON() : null;
  };

  static add = async (db: RxDatabase, object: RxDocument<any>, tableName: string): Promise<any> => {
    const timestamp = +new Date();
    const result = await db[tableName].insert(Object.assign({}, object, {
      id: uuidv4(),
      created: timestamp,
      updated: timestamp,
    }));
    return result.toJSON();
  };

  static update = async (db: RxDatabase, object: RxDocument<any>, tableName: string): Promise<any> => {
    const timestamp = +new Date();
    const result = await db[tableName].upsert(Object.assign({}, object, {
      updated: timestamp,
    }));
    return result.toJSON();
  };

  static delete = async (db: RxDatabase, id: string, tableName: string): Promise<any> => {
    const query = db[tableName].find().where('id').eq(id);
    const response = await query.remove();
    await db['deletion'].insert({
      id: uuidv4(),
      collectionName: tableName,
      itemId: id,
    } as Deletion);
    return response;
  };

  static find = async (db: RxDatabase, field: string, value: any, tableName: string): Promise<any> => {
    const query = db[tableName]
      .find()
      .where(field)
      .eq(value);
    const results: RxDocument<any> = await query.exec();

    return results ? results.map((result: any) => result.toJSON()) : null;
  };

  static deleteAssociations = async (db: RxDatabase, deletions: AssociationsToDelete[], id: string): Promise<any> => {
    return Promise.all(deletions.map(({ tableName, key }) => {
      const query = db[tableName].find().where(key).eq(id);
      return query.remove();
    }));
  };

  static addAttachment = async (
    db: RxDatabase,
    { id, data }: { id: string; data: string },
    tableName: string
  ): Promise<string> => {
    const query = db[tableName].find().where('id').eq(id);
    const result: RxDocument<any> = await query.exec();
    const uuid = uuidv4();
    const attachment = await result.putAttachment(
      {
          id: uuid,     // (string) name of the attachment like 'cat.jpg'
          data,   // (string|Blob|Buffer) data of the attachment
          type: 'image/jpeg'   // (string) type of the attachment-data like 'image/jpeg'
      },
    );
    return attachment.id;
  };

  static fetchAttachment = async (db: RxDatabase, id: string, localUrl: string, tableName: string): Promise<any> => {
    const query = db[tableName].find().where('id').eq(id);
    const result: RxDocument<any> = await query.exec();
    const attachment = await result.getAttachment(localUrl);
    return attachment.getStringData();
  };
}
