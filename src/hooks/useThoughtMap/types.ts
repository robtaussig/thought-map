import { Vertex } from './graph';

export interface Visited {
  [id: string]: boolean;
}

export interface Node {
  vertex: Vertex;
  y: number;
  x: number;
}
