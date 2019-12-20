import { expose } from 'comlink';
import { Searchable } from '../ThoughtSearch';

const searchable = new Searchable();

expose(searchable);
