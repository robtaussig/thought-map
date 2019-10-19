import { Thought } from '../../../store/rxdb/schemas/thought';
import { Connections } from '../../../reducers';
import { Graph, Vertex } from './graph';
import { Visited, Node } from './types';
import { findRelations, getTree } from './util';

export interface ThoughtsById {
  [thoughtId: string]: Thought;
}

export default class Grapher {
  private graph: Graph = new Graph();
  private origin: string;
  private visited: Visited = {};

  static draw = (canvas: HTMLCanvasElement, graph: Node[]): void => {
    console.log(canvas, graph)
  }

  update = (thought: Thought, connections: Connections): Grapher => {
    if (!thought) return this;
    this.origin = thought.id;
    Object.entries(connections).forEach(([ connectionId, { from, to }]) => {
      if (!this.visited[from]) {
        this.visited[from] = true;
        this.graph.addVertex(from);
      }

      if (!this.visited[to]) {
        this.visited[to] = true;
        this.graph.addVertex(to);
      }

      this.graph.addEdge(to, from);
    });
    
    return this;
  }

  generate = (setter: (state: Node[]) => void) => {
    const relations = findRelations(this.origin, this.graph);
    const tree = getTree(relations);
    setter(tree);
  }
}
