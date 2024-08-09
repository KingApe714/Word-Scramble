export const gamePlay = (gameWords, gameChars, winningWords) => {
  const usedTileContainer = document.querySelector(".used-tile-container");
  const unusedTileContainer = document.querySelector(".unused-tile-container");
  const gameTiles = document.querySelectorAll(".game-tile-container");
  const positions = ["0%", "15%", "30%", "45%", "60%", "75%", "90%"];

  const handleGameTile = (e, currentNode) => {
    e.preventDefault();
    const node = currentNode || e.target;
    const parentNode = node.parentNode;

    const moveNodes = (nextContainer) => {
      // add node to next container
      const idx = nextContainer.children.length;
      const left = positions[idx];
      node.style.left = left;
      nextContainer.appendChild(node);

      // readjust previous container
      const divs = Array.from(parentNode.children);

      for (let i = 0; i < divs.length; i += 1) {
        const div = divs[i];
        div.style.left = positions[i];
      }
    };

    if (parentNode.className === "unused-tile-container") {
      moveNodes(usedTileContainer);
    } else {
      moveNodes(unusedTileContainer);
    }
  };

  for (const gameTile of gameTiles) {
    gameTile.addEventListener("mousedown", handleGameTile);
    gameTile.addEventListener("touchstart", handleGameTile);
  }

  const handleEnter = (e) => {
    e.preventDefault();
    const arr = ["", "", "", "", "", "", ""];
    const nodes = usedTileContainer.children;

    for (const node of nodes) {
      const left = node.style.left;
      const idx = positions.indexOf(left);
      arr[idx] = node.innerHTML;
    }

    const word = arr.join("");
    console.log(word);

    if (gameWords.has(word)) {
      const clueWordContainer = gameWords.get(word);

      for (let i = 0; i < word.length; i += 1) {
        const div = clueWordContainer.children[i];
        const char = word[i];
        div.innerHTML = char;
      }
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    const nodes = Array.from(usedTileContainer.children).sort(
      (a, b) =>
        positions.indexOf(a.style.left) - positions.indexOf(b.style.left)
    );
    let idx = unusedTileContainer.children.length;

    for (const node of nodes) {
      const left = positions[idx];
      node.style.left = left;
      unusedTileContainer.appendChild(node);
      idx += 1;
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    const nodes = Array.from(usedTileContainer.children).sort(
      (a, b) =>
        positions.indexOf(a.style.left) - positions.indexOf(b.style.left)
    );

    if (nodes.length) {
      const node = nodes[nodes.length - 1];
      let idx = unusedTileContainer.children.length;
      const left = positions[idx];
      node.style.left = left;
      unusedTileContainer.appendChild(node);
    }
  };

  const handleShuffle = (e) => {
    e.preventDefault();
    console.log("Shuffle event triggered");

    const shuffleArray = (arr) => {
      for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    };

    const divs = Array.from(unusedTileContainer.children);
    const positions = divs.map((_, idx) => ({
      idx,
      left: `${idx * 15}%`,
    }));

    shuffleArray(positions);
    for (let i = 0; i < divs.length; i += 1) {
      const div = divs[i];
      const left = positions[i].left;
      div.style.left = left;
    }
  };

  const enterButton = document.querySelector(".enter");
  const clearButton = document.querySelector(".clear");
  const deleteButton = document.querySelector(".delete");
  const shuffleButton = document.querySelector(".shuffle");

  enterButton.addEventListener("mousedown", handleEnter);
  enterButton.addEventListener("touchstart", handleEnter);

  clearButton.addEventListener("mousedown", handleClear);
  clearButton.addEventListener("touchstart", handleClear);

  deleteButton.addEventListener("mousedown", handleDelete);
  deleteButton.addEventListener("touchstart", handleDelete);

  shuffleButton.addEventListener("mousedown", handleShuffle);
  shuffleButton.addEventListener("touchstart", handleShuffle);

  document.addEventListener("keydown", (e) => {
    const key = e.key.toUpperCase();
    const node = Array.from(unusedTileContainer.children).find(
      (node) => node.innerHTML === key
    );

    if (node) {
      handleGameTile(e, node);
    } else if (key === "ENTER") {
      handleEnter(e);
    } else if (key === "SHIFT") {
      handleClear(e);
    } else if (key === "BACKSPACE") {
      handleDelete(e);
    }
  });
};
