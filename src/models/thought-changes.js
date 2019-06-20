import Base from './base';

export const TABLE_NAME = 'thoughtChanges';

export default class ThoughtChanges extends Base {
  static props = {
    id: Number,
    thoughtId: Number,
    fields: String,
    froms: String,
    tos: String,
    created: Number,
  }
  static fetchAll = db => Base.fetchAll(db, TABLE_NAME)
  static fetch = (db, id) => Base.fetch(db, TABLE_NAME, id)
  static add = (db, object) => Base.add(db, TABLE_NAME, object)
  static update = (db, object) => Base.update(db, TABLE_NAME, object)
  static delete = (db, id) => Base.delete(db, TABLE_NAME, id)
}
