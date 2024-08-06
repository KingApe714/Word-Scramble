export const findWinningWord = (words) => {
  const winningWords = words.filter((w) => w.length === 7);
  const randomIndex = Math.floor(Math.random() * winningWords.length);
  return winningWords[randomIndex];
};

const buildWordContainer = (word, gameWords, definition) => {
  const clueContainer = document.querySelector(".clue-container");
  const definitionsContainer = document.querySelector(".definitions-container");
  const wordContainer = document.createElement("div");

  wordContainer.className = "clue-word-container";
  wordContainer.addEventListener("mousedown", (e) => {
    e.preventDefault();
    definitionsContainer.innerHTML = definition || null;
  });

  wordContainer.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      definitionsContainer.innerHTML = definition || null;
    },
    { passive: true }
  );

  for (const char of word) {
    const charContainer = document.createElement("div");
    charContainer.className = "clue-char-container";

    // charContainer.innerHTML = char; // remove this later

    wordContainer.appendChild(charContainer);
  }

  gameWords.set(word, wordContainer);
  clueContainer.appendChild(wordContainer);
};

export const findGameWords = (root, winningWord, definitions) => {
  const queue = [{ node: root, fragment: winningWord }];
  const gameWords = new Map();
  const winningWords = [];

  while (queue.length) {
    const { node, fragment } = queue.shift();

    if (node.word && !gameWords.has(node.word)) {
      buildWordContainer(node.word, gameWords, definitions[node.word]);
      if (node.word.length === 7) winningWords.push(node.word);
    }

    for (let i = 0; i < fragment.length; i += 1) {
      const char = fragment[i];
      if (char in node.children) {
        const child = node.children[char];
        const frag = fragment.slice(0, i) + fragment.slice(i + 1);
        queue.push({ node: child, fragment: frag });
      }
    }
  }

  return [gameWords, winningWords];
};

export const populateGameTiles = (winningWords) => {
  const gameTiles = document.querySelectorAll(".game-tile-container");
  let word = winningWords[0];
  const arr = word.split("");

  while (winningWords.includes(word)) {
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    word = arr.join("");
  }

  for (let i = 0; i < arr.length; i += 1) {
    const tile = gameTiles[i];
    const char = arr[i];
    tile.innerHTML = char;
  }

  return arr;
};
