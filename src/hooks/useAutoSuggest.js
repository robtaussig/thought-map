import React, { useState, useEffect, useRef } from 'react';

export const useAutoSuggest = (inputValue, historicalEntries, limit) => {
  const [suggestionList, setSuggestionList] = useState([]);
  const autoSuggest = useRef(null);

  const getAutoSuggest = () => {
    if (autoSuggest.current === null) {
      autoSuggest.current = new AutoSuggest();
    }
    return autoSuggest.current;
  };

  useEffect(() => {
    getAutoSuggest().process(historicalEntries);
  }, [historicalEntries]);

  useEffect(() => {
    const nextSuggestionList = getAutoSuggest().generateSuggestions(inputValue)

    setSuggestionList(limit ? nextSuggestionList.slice(0, limit) : nextSuggestionList);
  }, [inputValue, limit]);

  return suggestionList;
};

const formatWord = word => word.trim().toLowerCase();

class AutoSuggest {
  constructor() {
    this.visited = {};
    this.trie = new Trie();
    this.markovChain = new MarkovChain();
  }

  process(historicalEntries) {
    historicalEntries
      .map(formatWord)
      .filter(entry => this.visited[entry] !== true)
      .forEach(entry => {
        this.visited[entry] = true;
        const doubleSpacesConsolidated = entry.replace(/\s+/g, " ").split(' ');
        
        this.trie.add(doubleSpacesConsolidated);
        this.markovChain.record(doubleSpacesConsolidated);
      });

    //Return this so that process and generateSuggestions can be chained
    return this
  }

  generateSuggestions(inputValue) {
    if (!inputValue) return [];
    const splitSentence = inputValue.trim().split(' ');
    const lastWord = formatWord(splitSentence[splitSentence.length - 1]);
    const results = this.markovChain.suggest(lastWord)
                                    .concat(this.trie.suggest(lastWord))
                                    .filter(result => result !== lastWord);
    return [...new Set(results)];
  }
}

//Because double spaces are stripped for a single space, the following string is an impossible valid entry, and thus can be relied on to be unique
const COMPLETE_WORD = '*  *';

class Trie {
  constructor() {
    this.rootNode = {};
  }

  add(valuesArray) {
    for (let i = 0; i < valuesArray.length; i++) {
      let currentNode = this.rootNode;
      const word = valuesArray[i];
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

  record(valuesArray) {
    let currentWord = valuesArray[0];
    for (let i = 1; i < valuesArray.length; i++) {
      const nextWord = valuesArray[i];
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
        .map(([key, value]) => ` ${key}`); //Prepend space to indicate that suggestion is for the next word as opposed to replacing current last word
    }
    return [];
  }
}