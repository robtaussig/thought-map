import { Thought } from '../../../store/rxdb/schemas/thought';
import { Connections } from '../../../reducers';

export interface ThoughtsById {
  [thoughtId: string]: Thought;
}

type Position = [number, number];

export interface Vertice {
  label: string;
  pos: Position;
  id: string;
}

export interface Edge {
  from: Position;
  to: Position;
}

export interface GraphType {
  vertices: Vertice[];
  edges: Edge[];
}

export default class Grapher {

  static draw = (canvas: HTMLCanvasElement, graph: GraphType): void => {
    console.log(canvas, graph)
  }

  update = (thought: Thought, thoughtsById: ThoughtsById, connections: Connections): Grapher => {
    console.log(thought, thoughtsById, connections);
    return this;
  }

  generate = (setter: (state: GraphType) => void) => {
    console.log(this);
  }
}
