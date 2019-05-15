import { db } from '../store/database';
import { withTime } from './util';

export default class Base {
  static fetchAll = async tableName => {
    const dbResponse = await db.select({ table: tableName });
    return dbResponse.result.sort((a, b) => a.id - b.id);
  }

  static fetch = async (tableName, id) => {
    const dbResponse = await db.select({ table: tableName }, id);

    return dbResponse.result[0];
  }

  static add = async (tableName, connection) => {
    const connectionObject = withTime(connection);
    const response = await db.insert({ table: tableName, object: connectionObject });
  
    return Object.assign({}, connectionObject, { id: response.result });
  }

  static update = async (tableName, connection) => {
    const connectionObject = Object.assign({}, connection, {
      updatedAt: new Date() - 1,
    });

    await db.insert({ table: tableName, object: connectionObject });
  
    return connectionObject;
  }

  static delete = async (tableName, id) => {
    const response = await db.delete({ table: tableName, id });
  
    return response;
  }
}
