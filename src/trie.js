const trieNode = function (char) {
  this.char = char;
  this.children = {};
  this.word = null;
};

export const buildTrie = (words) => {
  const root = new trieNode(null);

  for (const word of words) {
    let current = root;

    for (const char of word) {
      if (!(char in current.children)) {
        current.children[char] = new trieNode(char);
      }

      current = current.children[char];
    }

    current.word = word;
  }

  return root;
};
