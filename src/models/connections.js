import Base from './base';

const TABLE_NAME = 'connections';

export default class Connections extends Base {
  static props = {
    id: Number,
    to: Number,
    from: Number,
  }
  static fetchAll = () => Base.fetchAll(TABLE_NAME)
  static fetch = id => Base.fetch(TABLE_NAME, id)
  static add = object => Base.add(TABLE_NAME, object)
  static update = object => Base.update(TABLE_NAME, object)
  static delete = id => Base.delete(TABLE_NAME, id)
}
