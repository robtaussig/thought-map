import { RxJsonSchema, RxCollectionCreator } from 'rxdb';
import thought from './thought';
import note from './note';
import tag from './tag';
import connection from './connection';
import plan from './plan';
import template from './template';

type SchemaTuple = [string, RxJsonSchema, RxCollectionCreator?];

export default [plan, thought, note, tag, connection, template] as [SchemaTuple, SchemaTuple, SchemaTuple, SchemaTuple, SchemaTuple, SchemaTuple];
