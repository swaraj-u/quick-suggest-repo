const express = require('express');
const fs = require('fs');
const cors = require('cors');
const Trie = require('./trie');

const app = express();
const PORT = 5000;
app.use(cors());

const words = JSON.parse(fs.readFileSync('./words.json', 'utf8'));

const trie = new Trie();
words.forEach(word => trie.insert(word.toLowerCase()));

function levenshteinDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],
          dp[i][j - 1],
          dp[i - 1][j - 1]
        );
      }
    }
  }

  return dp[a.length][b.length];
}

app.get('/api/suggest', (req, res) => {
  const query = req.query.q || '';
  let suggestions = trie.suggest(query.toLowerCase());

  if (suggestions.length < 3 && query.length > 1) {
    const closeMatches = words
      .map(word => ({ word, dist: levenshteinDistance(query, word) }))
      .filter(entry => entry.dist <= 2)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 5)
      .map(e => e.word);

    suggestions = [...new Set([...suggestions, ...closeMatches])];
    console.log("suggestions: ", suggestions);
  }

  res.json(suggestions);
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
