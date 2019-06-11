import Base from './base';

const TABLE_NAME = 'connections';

export default class Connections extends Base {
  static props = {
    id: Number,
    to: Number,
    from: Number,
    created: Number,
    updated: Number,
    deleted: Number,
  }
  static fetchAll = db => Base.fetchAll(db, TABLE_NAME)
  static fetch = (db, id) => Base.fetch(db, TABLE_NAME, id)
  static add = (db, object) => Base.add(db, TABLE_NAME, object)
  static update = (db, object) => Base.update(db, TABLE_NAME, object)
  static delete = (db, id) => Base.delete(db, TABLE_NAME, id)
}
