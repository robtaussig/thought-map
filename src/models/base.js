import uuidv4 from 'uuid/v4';

const toJSON = res => res.toJSON();

export const sortByIndexThenDate = (resLeft, resRight) => {
  if (resLeft.index || resRight.index) {
    if (resRight.index > resLeft.index) return -1;
    return 1;
  } else {
    return resRight.updated - resLeft.updated;
  }
};

export default class Base {
  static fetchAll = async (db, tableName) => {
    const query = db[tableName].find();
    const results = await query.exec();
    return results
      .map(toJSON)
      .sort(sortByIndexThenDate);
  }

  static fetch = async (db, tableName, id) => {
    const query = db[tableName].find({ id: { $eq: id } });
    const result = await query.exec();
    return result.toJSON();
  }

  static add = async (db, tableName, object) => {
    const timestamp = new Date() - 1;
    const result = await db[tableName].insert(Object.assign({}, object, {
      id: uuidv4(),
      created: timestamp,
      updated: timestamp,
    }));
    return result.toJSON();
  }

  static update = async (db, tableName, object) => {
    const timestamp = new Date() - 1;
    const result = await db[tableName].upsert(Object.assign({}, object, {
      updated: timestamp,
    }));
    return result.toJSON();
  }

  static delete = async (db, tableName, id) => {
    const query = db[tableName].find({ id: { $eq: id } });
    const response = await query.remove();

    return response;
  }
}
