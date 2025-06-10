class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.freq = 0;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (let ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEndOfWord = true;
    node.freq++;
  }

  suggest(prefix) {
    let node = this.root;
    for (let ch of prefix) {
      if (!node.children[ch]) return [];
      node = node.children[ch];
    }

    const result = [];

    const dfs = (n, path) => {
      if (n.isEndOfWord) result.push({ word: path, freq: n.freq });
      for (let ch in n.children) dfs(n.children[ch], path + ch);
    };

    dfs(node, prefix);

    return result
      .sort((a, b) => b.freq - a.freq)
      .slice(0, 5)
      .map((e) => e.word);
  }
}

module.exports = Trie;
