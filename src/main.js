import { buildTrie } from "./trie.js";
import {
  findWinningWord,
  findGameWords,
  populateGameTiles,
} from "./buildGame.js";
import { gamePlay } from "./buildGamePlay.js";

const fetchDefinitions = async () => {
  const response = await fetch("./json/definitions.json");
  const definitions = await response.json();

  return definitions;
};

// consider making a 6 letter game with a 7 letter game
// I might need to find all of the 7 letter words that actually generate good boards
// Maybe make tile completion a neiche of KingApe Cafe
// I need to populate the game tiles with their relevant chars without displaying any of the actual words
const initGame = async () => {
  const definitions = await fetchDefinitions();
  const words = Object.keys(definitions);
  const root = buildTrie(words);
  const winningWord = findWinningWord(words);
  const [gameWords, winningWords] = findGameWords(
    root,
    winningWord,
    definitions
  );

  console.log(gameWords);
  const gameChars = populateGameTiles(winningWords);
  gamePlay(gameWords, gameChars, winningWords);
};

initGame();
