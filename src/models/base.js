// import { db } from '../store/database';
import { withTime } from './util';

export default class Base {
  static fetchAll = async (db, tableName) => {
    console.log('fetchAll', db, tableName);
    // const dbResponse = await db.select({ table: tableName });
    // return dbResponse.result.sort((a, b) => a.id - b.id);
    return [];
  }

  static fetch = async (db, tableName, id) => {
    console.log('fetch', db, tableName, id);
    // const dbResponse = await db.select({ table: tableName }, id);

    // return dbResponse.result[0];
    return {};
  }

  static add = async (db, tableName, connection) => {
    console.log('add', db, tableName, connection);
    // const connectionObject = withTime(connection);
    // const response = await db.insert({ table: tableName, object: connectionObject });
  
    // return Object.assign({}, connectionObject, { id: response.result });
    return {};
  }

  static update = async (db, tableName, connection) => {
    console.log('update', db, tableName, connection);
    // const connectionObject = Object.assign({}, connection, {
    //   updatedAt: new Date() - 1,
    // });

    // await db.insert({ table: tableName, object: connectionObject });
  
    // return connectionObject;
    return {};
  }

  static delete = async (db, tableName, id) => {
    console.log('delete', db, tableName, id);
    // const response = await db.delete({ table: tableName, id });
  
    // return response;
    return {};
  }
}
