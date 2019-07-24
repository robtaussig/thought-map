import React, { useState, useEffect, useRef } from 'react';

export const useAutoSuggest = (inputValue, historicalEntries) => {
  const [wordMap, setWordMap] = useState([]);
  const lastEntries = useRef(null);
  const markovChain = useRef(null);

  const getAutoSuggest = () => {
    if (markovChain.current === null) {
      markovChain.current = new AutoSuggest();
    }
    return markovChain.current;
  };

  useEffect(() => {
    let nextWordMap;

    if (lastEntries.current === historicalEntries) {
      nextWordMap = getAutoSuggest().generateSuggestions(inputValue);
    } else {
      nextWordMap = getAutoSuggest()
                      .process(historicalEntries)
                      .generateSuggestions(inputValue);

      lastEntries.current = historicalEntries;
    }

    setWordMap(nextWordMap);
  }, [inputValue, historicalEntries]);

  return wordMap;
};

const formatWord = word => word.trim().toLowerCase();

class AutoSuggest {
  constructor() {
    this.visited = {};
    this.trie = new Trie();
    this.markovChain = new MarkovChain();
  }

  process(historicalEntries) {
    historicalEntries.map(formatWord).forEach(entry => {
      if (this.visited[entry] !== true) {
        const splitEntryWithPunctuationRemoved =
          entry.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").split(' ');

        this.trie.add(splitEntryWithPunctuationRemoved);
        this.visited[entry] = true;
      }
      this.markovChain.record(splitEntryWithPunctuationRemoved);
    });

    return this
  }

  generateSuggestions(inputValue) {
    const splitSentence = inputValue.trim().split(' ');
    const lastWord = formatWord(splitSentence[splitSentence.length - 1]);
    const results = this.markovChain.suggest(lastWord)
                             .concat(this.trie.suggest(lastWord));
    return [...new Set(results)];
  }
}

const COMPLETE_WORD = '*  *';

class Trie {
  constructor() {
    this.rootNode = {};
  }

  add(values) {
    for (let i = 0; i < values.length; i++) {
      let currentNode = this.rootNode;
      const word = values[i];
      for (let j = 0; j < word.length; j++) {
        const char = word[j];
        currentNode[char] = currentNode[char] || {};
        currentNode = currentNode[char];
      }
      currentNode[COMPLETE_WORD] = true;
    }
  }

  findCompleteWordsAtDepth(wordPrefix, node, depth) {
    if (depth === 0) {
      if (node[COMPLETE_WORD]) {
        return [wordPrefix];
      };
      return [];
    }
    const suggestions = [];
    if (node[COMPLETE_WORD]) {
      suggestions.push(wordPrefix);
    }
    for (let char in node) {
      
      if (typeof node[char] === 'object') suggestions.push(...this.findCompleteWordsAtDepth(wordPrefix + char, node[char], depth - 1));
    }
    return suggestions;
  }

  suggest(value) {
    let currentNode = this.rootNode;
    const suggestions = [];
    for (let i = 0; i < value.length; i++) {
      if (currentNode[value[i]] === undefined) return [];
      currentNode = currentNode[value[i]];
    }
    if (currentNode[COMPLETE_WORD]) {
      suggestions.push(value);
    };
  
    suggestions.push(...this.findCompleteWordsAtDepth(value, currentNode, 4));

    return suggestions;
  }
}

class MarkovChain {
  constructor() {
    this.chain = {};
  }

  record(values) {
    let currentWord = values[0];
    for (let i = 1; i < values.length; i++) {
      const nextWord = values[i];
      this.chain[currentWord] = this.chain[currentWord] || {};
      this.chain[currentWord][nextWord] = this.chain[currentWord][nextWord] || 0;
      this.chain[currentWord][nextWord]++;
      currentWord = nextWord;
    }
  }

  suggest(value) {
    if (this.chain[value]) {
      return Object.entries(this.chain[value])
        .sort(([aKey, aValue], [bKey, bValue]) => aValue > bValue ? -1 : 1)
        .map(([key, value]) => ` ${key}`);
    }
    return [];
  }
}