import Base from './base';

export const TABLE_NAME = 'template';

export default class Templates extends Base {
  static props = {
    id: Number,
    name: String,
    template: String,
    created: Number,
    updated: Number,
    deleted: Number,
  }
  static fetchAll = async db => {
    const objects = await Base.fetchAll(db, TABLE_NAME);
    return objects.map(({ template, ...rest }) => ({
      template: JSON.parse(template),
      ...rest,
    }));
  }
  static fetch = async (db, id) => {
    const { template, ...rest } = await Base.fetch(db, TABLE_NAME, id);
    return {
      template: JSON.parse(template),
      ...rest,
    };
  }
  static add = async (db, { template, ...rest }) => {
    const result = await Base.add(db, TABLE_NAME, {
      template: JSON.stringify(template),
      ...rest,
    });

    return {
      ...result,
      template: JSON.parse(result.template),
    };
  }
  static update = async (db, { template, ...rest }) => {
    return Base.update(db, TABLE_NAME, {
      template: JSON.stringify(template),
      ...rest,
    });
  }
  static delete = async (db, id) => Base.delete(db, TABLE_NAME, id)
}
