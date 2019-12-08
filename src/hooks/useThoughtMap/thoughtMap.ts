import { Graph } from './graph';
import { findRelations, getTree } from './util';

export default class ThoughtMap {
  private graph: Graph = new Graph();

  addThoughts = (thoughtIds: string[] = []) => {
    thoughtIds.forEach(thoughtId => {
      this.graph.addVertex(thoughtId);
    });
  }

  removeThought = (id: string) => {
    this.graph.removeVertex(id);
  }

  addConnections = (connections: [string, string][]) => {
    connections.forEach(([from, to]) => {
      this.graph.addEdge(to, from);
    });
  }

  removeConnection = (to: string, from: string) => {
    this.graph.removeEdge(to, from);
  }

  getDescendents = (id: string) => {
    return findRelations(id, this.graph, true);
  }

  generateThoughtMap = (id: string) => {
    return getTree(findRelations(id, this.graph, true));
  }
}
