import uuidv4 from 'uuid/v4';
import { RxDatabase, RxDocumentTypeWithRev } from 'rxdb';

const toJSON = (res: RxDocumentTypeWithRev<any>) => res.toJSON();

interface Sortable {
  index?: number,
  updated?: number,
}

interface Deletion {
  tableName: string,
  key: string,  
}

export const sortByIndexThenDate = (resLeft: Sortable, resRight: Sortable): number => {
  if (resLeft.index || resRight.index) {
    if (resRight.index > resLeft.index) return -1;
    return 1;
  } else {
    return resRight.updated - resLeft.updated;
  }
};

export default class Base {
  static fetchAll = async (db: RxDatabase, tableName: string): Promise<any[]> => {
    const query = db[tableName].find();
    const results = await query.exec();
    return results
      .map(toJSON)
      .sort(sortByIndexThenDate);
  }

  static fetch = async (db: RxDatabase, id: string, tableName: string): Promise<any> => {
    const query = db[tableName].find({ id: { $eq: id } });
    const result: RxDocumentTypeWithRev<any> = await query.exec();
    return result.toJSON();
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

    return response;
  }

  static deleteAssociations = async (db: RxDatabase, deletions: Deletion[], id: string): Promise<any> => {
    return Promise.all(deletions.map(({ tableName, key }) => {
      const query = db[tableName].find({ [key]: { $eq: id } });
      return query.remove();
    }));
  }
}
