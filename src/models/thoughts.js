import Base from './base';

const TABLE_NAME = 'thought';

export default class Thoughts extends Base {
  static props = {
    id: Number,
    planId: Number,
    title: String,
    type: String,
    status: String,
    description: String,
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
