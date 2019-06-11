// import { db } from '../store/database';
import { withTime } from './util';
import uuidv4 from 'uuid/v4';

export default class Base {
  static fetchAll = async (db, tableName) => {
    const query = db[tableName].find();
    const results = await query.exec();
    return results.map(result => result.toJSON());
  }

  static fetch = async (db, tableName, id) => {
    const query = db[tableName].find({ id: { $eq: id } });
    const result = await query.exec();
    return result.toJSON();
  }

  static add = async (db, tableName, object) => {
    const result = await db[tableName].insert(Object.assign({}, object, {
      id: uuidv4(),
    }));
    return result.toJSON();
  }

  static update = async (db, tableName, object) => {
    const query = db[tableName].upsert(object);
    const result = await query.exec();
    return result.toJSON();
  }

  static delete = async (db, tableName, id) => {
    const query = db[tableName].find({ id: { $eq: id } });
    const response = await query.remove();

    return response;
  }
}
