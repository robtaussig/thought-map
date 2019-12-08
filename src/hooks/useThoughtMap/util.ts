import { Graph, Vertex } from './graph';
import { Visited, Node } from './types';

export const getDepth = (vertex: Vertex, visited: Visited, depth: number = 0): number => {
  visited[vertex.id] = true;
  if (vertex.prev.size === 0) return depth;

  return Math.max(...[...vertex.prev].map(child => {
    if (!visited[child.id]) {
      return getDepth(child, visited, depth + 1);
    } else {
      return depth;
    }
  }));
};

export const getTree = (vertices: Vertex[]): Node[] => {
  const sorted = Graph.topologicalSort(vertices);
  return sorted.map((vertex, vertexIdx) => {
    return {
      vertex,
      y: vertexIdx,
      x: getDepth(vertex, {}),
    };
  });
};

export const findRelations = (origin: string, graph: Graph, findOnlyDescendents: boolean = false): Vertex[] => {
  const descendents: Vertex[] = [];
  const visited: Visited = {};
  const node = graph.vertices.find(vertex => vertex.id === origin);
  if (node) {
    Graph.dfs(node, visited, child => {
      descendents.push(child);
    }, findOnlyDescendents);
  }
  
  return descendents;
};
