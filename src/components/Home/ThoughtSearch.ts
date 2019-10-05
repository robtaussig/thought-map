import { Thought } from 'store/rxdb/schemas/thought';
import { Note } from 'store/rxdb/schemas/note';
import { Tag } from 'store/rxdb/schemas/tag';

export interface ThoughtMatch {
  id: string;
  title?: string;
}

interface TrieNode {
  [char: string]: TrieNode;
}

interface TrieNodes {
  [thoughtId: string]: TrieNode;
}

export interface Notes {
  [noteId: string]: Note;
}

export interface Tags {
  [tagId: string]: Tag;
}

export class Searchable {
  roots: TrieNodes = {};

  buildTree = (thoughts: Thought[], notes: Notes, tags: Tags): void => {

    thoughts.forEach(({ id, date, description, status, time, title, type }) => {
      this.buildNode(id, [date, description, status, time, title, type]);
    });

    Object.values(notes).forEach(({ thoughtId, text }) => {
      this.buildNode(thoughtId, [text]);
    });

    Object.values(tags).forEach(({ thoughtId,  text }) => {
      this.buildNode(thoughtId, [text]);
    });
  }

  buildNode = (thoughtId: string, values: (string|number)[]): void => {
    this.roots[thoughtId] = this.roots[thoughtId] || {};
    let node = this.roots[thoughtId];
    values.forEach(value => {
      String(value).toLowerCase().split(' ').forEach(word => {
        node = this.roots[thoughtId];
        word.split('').forEach(char => {
          node[char] = node[char] || {};
          node = node[char];
        });
      });
    });
  }

  hasMatch = (input: string) => ([thoughtId, rootNode]: [string, TrieNode]): boolean => {
    let node = rootNode;
    
    for (let i = 0; i < input.length; i++) {
      if (!node[input[i]]) return false;
      node = node[input[i]];
    }

    return true;
  }

  findMatches = (input: string): ThoughtMatch[] => {
    if (input === '') return [];
    const matches: ThoughtMatch[] = Object.entries(this.roots).filter(this.hasMatch(input.toLowerCase())).map(([key]) => {
      return {
        id: key,
      }
    });

    return matches;
  }
}
