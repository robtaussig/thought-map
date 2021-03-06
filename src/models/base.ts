import uuidv4 from 'uuid/v4';
import { RxDatabase, RxDocumentTypeWithRev } from 'rxdb';
import { Deletion } from '../store/rxdb/schemas/deletion';

const toJSON = (res: RxDocumentTypeWithRev<any>) => res.toJSON();

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
  }

  static fetch = async (db: RxDatabase, id: string, tableName: string): Promise<any> => {
    const query = db[tableName].find({ id: { $eq: id } });
    const result: RxDocumentTypeWithRev<any> = await query.exec();

    return result && result[0] ? result[0].toJSON() : null;
  }

  static add = async (db: RxDatabase, object: RxDocumentTypeWithRev<any>, tableName: string): Promise<any> => {
    const timestamp = +new Date();
    const result = await db[tableName].insert(Object.assign({}, object, {
      id: uuidv4(),
      created: timestamp,
      updated: timestamp,
    }));
    return result.toJSON();
  }

  static update = async (db: RxDatabase, object: RxDocumentTypeWithRev<any>, tableName: string): Promise<any> => {
    const timestamp = +new Date();
    const result = await db[tableName].upsert(Object.assign({}, object, {
      updated: timestamp,
    }));
    return result.toJSON();
  }

  static delete = async (db: RxDatabase, id: string, tableName: string): Promise<any> => {
    const query = db[tableName].find({ id: { $eq: id } });
    const response = await query.remove();
    await db['deletion'].insert({
      id: uuidv4(),
      collectionName: tableName,
      itemId: id,
    } as Deletion);
    return response;
  }

  static find = async (db: RxDatabase, field: string, value: any, tableName: string): Promise<any> => {
    const query = db[tableName]
      .find()
      .where(field)
      .eq(value);
    const results: RxDocumentTypeWithRev<any> = await query.exec();

    return results ? results.map((result: any) => result.toJSON()) : null;
  }

  static deleteAssociations = async (db: RxDatabase, deletions: AssociationsToDelete[], id: string): Promise<any> => {
    return Promise.all(deletions.map(({ tableName, key }) => {
      const query = db[tableName].find({ [key]: { $eq: id } });
      return query.remove();
    }));
  }
}
