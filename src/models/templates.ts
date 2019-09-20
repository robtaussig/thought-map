import { RxDatabase } from 'rxdb';
import { Template } from 'store/rxdb/schemas/template';
import Base from './base';

export const TABLE_NAME = 'template';

export default class Templates extends Base {
  static fetchAll = async (db: RxDatabase): Promise<Template[]> => {
    const objects = await Base.fetchAll(db, TABLE_NAME);
    return objects.map(({ template, ...rest }) => ({
      template: JSON.parse(template),
      ...rest,
    }));
  }
  static fetch = async (db: RxDatabase, id: string): Promise<Template> => {
    const { template, ...rest } = await Base.fetch(db, id, TABLE_NAME);
    return {
      template: JSON.parse(template),
      ...rest,
    };
  }
  static add = async (db: RxDatabase, { template, ...rest }: Template): Promise<Template> => {
    return Base.add(db, {
      template: JSON.stringify(template),
      ...rest,
    }, TABLE_NAME);
  }
  static update = async (db: RxDatabase, { template, ...rest }: Template): Promise<Template> => {
    return Base.update(db, {
      template: JSON.stringify(template),
      ...rest,
    }, TABLE_NAME);
  }
  static delete = async (db: RxDatabase, id: string): Promise<any> => Base.delete(db, id, TABLE_NAME)
}
