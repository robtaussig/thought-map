import Base from './base';

const TABLE_NAME = 'thoughts';

export default class Thoughts extends Base {
  static props = {
    id: Number,
    text: String,
  }
  static fetchAll = () => Base.fetchAll(TABLE_NAME)
  static fetch = id => Base.fetch(TABLE_NAME, id)
  static add = object => Base.add(TABLE_NAME, object)
  static update = object => Base.update(TABLE_NAME, object)
  static delete = id => Base.delete(TABLE_NAME, id)
}
