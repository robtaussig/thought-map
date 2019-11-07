import { Visited } from './types';

export class Vertex {
  next: Set<Vertex> = new Set();
  prev: Set<Vertex> = new Set();
  public id: string;

  constructor(id: string) {
    this.id = id;
  }

  addNext(vertex: Vertex) {
    this.next.add(vertex);
  }

  addPrev(vertex: Vertex) {
    this.prev.add(vertex);
  }
}

export class Graph {
  vertices: Vertex[] = []

  static dfs = (vertex: Vertex, visited: Visited = {}, processVertex = (vertex: Vertex) => {}, findOnlyNext: boolean = false) => {
    visited[vertex.id] = true;
    vertex.next.forEach(child => {
      if (!visited[child.id]) {
        Graph.dfs(child, visited, processVertex, findOnlyNext);
      }
    });
    if (findOnlyNext !== true) {
      vertex.prev.forEach(child => {
        if (!visited[child.id]) {
          Graph.dfs(child, visited, processVertex, findOnlyNext);
        }
      });
    }
    processVertex(vertex);
  }

  static topologicalSort = (vertices: Vertex[]): Vertex[] => {
    const stack: Vertex[] = [];
    const visited: Visited = {};
 
    vertices.forEach(vertex => {
      if (!visited[vertex.id]) {
        Graph.dfs(vertex, visited, vertex => {
          stack.push(vertex);
        });
      }
    });
 
    return stack;
  }

  static findMother = (vertices: Vertex[]): Vertex => {
    let visited: Visited = {};
    let last: Vertex;

    vertices.forEach(vertex => {
      if (!visited[vertex.id]) {
        Graph.dfs(vertex, visited);
        last = vertex;
      }
    });

    visited = {};
    Graph.dfs(last, visited);

    if (Object.keys(visited).length === vertices.length) return last;
    return null;
  }
  
  addVertex = (id: string): Vertex => {
    if (!this.vertices.find(vertex => vertex.id === id)) {
      const vertex = new Vertex(id);
      this.vertices.push(vertex);

      return vertex;
    }
  }

  addEdge = (from: string, to: string): void => {
    const fromVertex = this.vertices.find(({ id }) => id === from);
    const toVertex = this.vertices.find(({ id }) => id === to);
    
    fromVertex.addPrev(toVertex);
    toVertex.addNext(fromVertex);
  }
}
