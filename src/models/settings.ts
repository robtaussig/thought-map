import { RxDatabase } from 'rxdb';
import { Setting } from 'store/rxdb/schemas/setting';
import Base from './base';

export const TABLE_NAME = 'setting';

export default class Settings extends Base {
  static parseSetting = (setting: Setting): Setting => {
    return setting ? {
      ...setting,
      value: JSON.parse(setting.value)
    } : setting;
  }
  static fetchAll = async (db: RxDatabase): Promise<Setting[]> => {
    const results = await Base.fetchAll(db, TABLE_NAME);

    return results ? results.map<Setting>(Settings.parseSetting) : results;
  }
  static fetch = async (db: RxDatabase, id: string): Promise<Setting> => {
    const result = await Base.fetch(db, id, TABLE_NAME);

    return result ? Settings.parseSetting(result) : result;
  }
  static find = async (db: RxDatabase, field: string, value: string): Promise<Setting[]> => {
    const result = await Base.find(db, field, value, TABLE_NAME);

    return result ? result.map(Settings.parseSetting) : result;
  }
  static add = (db: RxDatabase, object: Setting): Promise<Setting> => Base.add(db, object, TABLE_NAME)
  static update = (db: RxDatabase, object: Setting): Promise<Setting> => Base.update(db, object, TABLE_NAME)
  static upsert = async (db: RxDatabase, object: Setting): Promise<Setting> => {
    const results = await Base.find(db, 'field', object.field, TABLE_NAME);
    if (results && results.length > 0) {
      return Settings.update(db, {
        ...results[0],
        value: JSON.stringify(object.value),
      });
    } else {
      return Settings.add(db, {
        ...object,
        value: JSON.stringify(object.value),
      });
    }
  }
  static delete = (db: RxDatabase, id: string): Promise<any> => Base.delete(db, id, TABLE_NAME)
}
