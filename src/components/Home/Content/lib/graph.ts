import { Graph as Base, Vertex } from '../../../../hooks/useThoughtMap/graph';
import { Thought } from '../../../../store/rxdb/schemas/thought';
import { Connection } from '../../../../store/rxdb/schemas/connection';

export class Graph extends Base {
  private thoughtMap: Map<string, Vertex> = new Map();
  private visitedConnections: Map<string, [string, string]> = new Map();

  public isRoot = (thoughtId: string): boolean => {
    const thought = this.thoughtMap.get(thoughtId);
    return thought && thought.prev.size === 0;
  };

  public childCount = (thoughtId: string): number => {
    const thought = this.thoughtMap.get(thoughtId);
    return thought ? thought.next.size : 0; 
  };

  public parentCount = (thoughtId: string): number => {
    const thought = this.thoughtMap.get(thoughtId);
    return thought ? thought.prev.size : 0; 
  };

  public children = (thoughtId: string): string[] => {
    const thought = this.thoughtMap.get(thoughtId);
    return thought ? [...thought.next].map(child => child.id) : [];
  };

  public descendants = (thoughtId: string): string[] => {
    const thought = this.thoughtMap.get(thoughtId);
    if (thought && thought.next.size > 0) {
      const descendants: Vertex[] = [];
      const processNode = (node: Vertex) => descendants.push(node);
      Graph.dfs(thought, {}, processNode, true);
      return descendants.filter(node => node.id !== thoughtId).map(node => node.id);
    }
    return [];
  };

  public parents = (thoughtId: string): string[] => {
    const thought = this.thoughtMap.get(thoughtId);
    return thought ? [...thought.prev].map(parent => parent.id) : [];
  };

  public ancestors = (thoughtId: string): string[] => {
    const thought = this.thoughtMap.get(thoughtId);
    if (thought && thought.prev.size > 0){
      const relatives: Vertex[] = [];
      const processNode = (node: Vertex) => relatives.push(node);
      Graph.dfs(thought, {}, processNode, true);
      const descendants = this.descendants(thoughtId);
      return relatives
        .filter(relative => relative.id !== thoughtId && descendants.includes(relative.id) === false)
        .map(relative => relative.id);
    }
    return [];
  };

  public updateThoughts = (thoughts: Thought[]): Graph => {
    const currentThoughts = new Set<string>();
    const thoughtsToRemove = new Set<string>();

    thoughts
      .forEach(thought => {
        currentThoughts.add(thought.id);
        if (this.thoughtMap.has(thought.id) === false) {
          const vertex = this.addVertex(thought.id);
          this.thoughtMap.set(thought.id, vertex);
        }
      });

    for (const [thoughtId] of this.thoughtMap) {
      if (currentThoughts.has(thoughtId) === false) {
        thoughtsToRemove.add(thoughtId);
      }
    }

    thoughtsToRemove.forEach(thoughtId => {
      this.removeThought(thoughtId);
    });

    return this;
  };

  public updateConnections = (connections: Connection[]): Graph => {
    const currentConnections = new Set<string>();
    const connectionsToRemove = new Set<string>();

    connections
      .filter(connection => {
        currentConnections.add(connection.id);
        return this.thoughtMap.has(connection.from) && this.thoughtMap.has(connection.to);
      })  
      .forEach(connection => {
        if (this.visitedConnections.has(connection.id) === false) {
          this.visitedConnections.set(connection.id, [connection.from, connection.to]);
          this.addEdge(connection.to, connection.from);
        }
      });

    for (const [connectionId] of this.visitedConnections) {
      if (currentConnections.has(connectionId) === false) {
        connectionsToRemove.add(connectionId);
      }
    }
    connectionsToRemove.forEach(connectionId => {
      this.removeConnection(connectionId);
    });

    return this;
  };

  private removeThought = (thoughtId: string) => {
    const thought = this.thoughtMap.get(thoughtId);
    [...thought.next].forEach(next => {
      thought.next.delete(next);
      next.prev.delete(thought);
    });
    [...thought.prev].forEach(prev => {
      thought.prev.delete(prev);
      prev.next.delete(thought);
    });

    this.thoughtMap.delete(thoughtId);
  };

  private removeConnection = (connectionId: string) => {
    const [from, to]: [string, string] = this.visitedConnections.get(connectionId);
    const fromThought = this.thoughtMap.get(from);
    const toThought = this.thoughtMap.get(to);
    if (fromThought && toThought) {
      fromThought.next.delete(toThought);
      toThought.prev.delete(fromThought);
    }

    this.visitedConnections.delete(connectionId);
  };
}

export default Graph;
