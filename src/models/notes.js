import Base from './base';

const TABLE_NAME = 'notes';

export default class Notes extends Base {
  static props = {
    id: Number,
    thoughtId: Number,
    text: String,
    index: Number,
    created: Number,
    updated: Number,
    deleted: Number,
  }
  static fetchAll = () => Base.fetchAll(TABLE_NAME)
  static fetch = id => Base.fetch(TABLE_NAME, id)
  static add = object => Base.add(TABLE_NAME, object)
  static update = object => Base.update(TABLE_NAME, object)
  static delete = id => Base.delete(TABLE_NAME, id)
}
