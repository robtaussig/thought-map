import { RxJsonSchema, RxCollectionCreator } from 'rxdb';
import thought from './thought';
import note from './note';
import tag from './tag';
import connection from './connection';
import plan from './plan';
import template from './template';
import picture from './picture';
import setting from './setting';
import status from './status';
import backup from './backup';
import customObject from './customObject';
import deletion from './deletion';
import bulkList from './bulkList';

type SchemaTuple = [string, RxJsonSchema<any>, RxCollectionCreator?];

export default [
    plan,
    thought,
    note,
    tag,
    connection,
    template,
    picture,
    setting,
    status,
    backup,
    customObject,
    deletion,
    bulkList,
] as [
  SchemaTuple,
  SchemaTuple,
  SchemaTuple,
  SchemaTuple,
  SchemaTuple,
  SchemaTuple,
  SchemaTuple,
  SchemaTuple,
  SchemaTuple,
  SchemaTuple,
  SchemaTuple,
  SchemaTuple,
  SchemaTuple,
];
