import { expose } from 'comlink';
import { Searchable } from '../components/Home/ThoughtSearch';

const searchable = new Searchable();

expose(searchable);
