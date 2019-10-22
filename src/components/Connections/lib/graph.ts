import { Visited } from './types';

export class Vertex {
  next: Vertex[] = [];
  prev: Vertex[] = [];
  public id: string;

  constructor(id: string) {
    this.id = id;
  }

  addNext(vertex: Vertex) {
    if (vertex && this.next.indexOf(vertex) === -1) this.next.push(vertex);
  }

  addPrev(vertex: Vertex) {
    if (vertex && this.prev.indexOf(vertex) === -1) this.prev.push(vertex);
  }
}

export class Graph {
  vertices: Vertex[] = []

  static dfs = (vertex: Vertex, visited: Visited = {}, processVertex = (vertex: Vertex) => {}, findOnlyDescendents: boolean = false) => {
    visited[vertex.id] = true;
    vertex.next.forEach(child => {
      if (!visited[child.id]) {
        Graph.dfs(child, visited, processVertex, findOnlyDescendents);
      }
    });
    if (findOnlyDescendents !== true) {
      vertex.prev.forEach(child => {
        if (!visited[child.id]) {
          Graph.dfs(child, visited, processVertex, findOnlyDescendents);
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
  
  addVertex = (id: string): void => {
    if (!this.vertices.find(vertex => vertex.id === id)) {
      this.vertices.push(new Vertex(id));
    }
  }

  addEdge = (from: string, to: string): void => {
    const fromVertex = this.vertices.find(({ id }) => id === from);
    const toVertex = this.vertices.find(({ id }) => id === to);
    
    fromVertex.addPrev(toVertex);
    toVertex.addNext(fromVertex);
  }
}
