const body = document.querySelector('.body')
const displayLetters = document.querySelector('.shuffled-letters');
const guessLetters = document.querySelector('.guessed-letters');
const correctEntries = document.querySelector('.correct-entries');
const enterButton = document.querySelector('.enter-button');
const shuffleButton = document.querySelector('.shuffle-button');
const clearButton = document.querySelector('.clear-button');
const pointsDiv = document.querySelector('.points');
const remainingWordsDiv = document.querySelector('.remaining-words')

let gameWords;
let passWords;
let globalDictionary = [];
let winningWords = [];
let correctGuesses = [];
let points = 0;
let letters;
let winningWord;
let guess = '';
let passStage = false;
let time;

game()

async function game() {
    await getDictionary()
    const root = new makeNode(null);
    for (const item of globalDictionary)
        add(item, 0, root);

    const startingMinutes = 1;
    time = startingMinutes * 60;
    timer()

    passStage = false;
    guess = ''
    letters = null;
    winningWord = winningWords[Math.floor(Math.random() * winningWords.length)];
    shuffle()
    displayLetters.innerHTML = letters;
    guessLetters.innerHTML = guess;
    correctEntries.innerHTML = '';
    pointsDiv.innerHTML = points;

    gameWords = fetchGameWords(root, winningWord)
    passWords = gameWords.filter(word => word.length === 7)

    body.addEventListener('keydown', handler)

    shuffleButton.addEventListener('click', function() {
        shuffle()
    })

    clearButton.addEventListener('click', function() {
        clear()
    })

    enterButton.addEventListener('click', function() {
        entries();
    })

    console.log(`letters = ${letters}`)
    console.log(`guess = ${guess}`)
    console.log(`winningWord = ${winningWord}`)
    console.log(`gameWords = ${gameWords}`)
    console.log(`passWords = ${passWords}`)
}

async function getDictionary() {
    const response = await fetch('dictionary.txt');
    const data = await response.text();
    //I now have the array of words that I want to work with
    globalDictionary = data.split(/\r?\n/).filter(word => {
        return word.length > 2 && word.length < 8
    })
    winningWords = globalDictionary.filter(word => {
        return word.length === 7
    })
}

function handler(e) {
    const str = e.key.toUpperCase();

    if (letters.includes(str)) {
        let idx = letters.indexOf(str)
        letters = letters.slice(0, idx) + letters.slice(idx + 1);
        guess += str;
    }
    if (str === "BACKSPACE") {
        let char = guess[guess.length - 1]
        guess = guess.slice(0, guess.length - 1)
        if (char) letters += char;
    } else if (str === "ENTER") {
        entries()
    } else if (str === "/") {
        clear()
    } else if (str === "SHIFT") {
        shuffle()
    }

    displayLetters.innerHTML = letters;
    guessLetters.innerHTML = guess;
    
    // console.log(`guess = ${guess}`)
    // console.log(`letters = ${letters}`)
}

function entries() {
    if (gameWords.includes(guess) && !correctGuesses.includes(guess)) {
        correctGuesses.push(guess);
        correctEntries.innerHTML += "<div>" + guess + "</div>";
        let remainingWords = gameWords.length - correctGuesses.length
        remainingWordsDiv.innerHtml = remainingWords;

        let multiplier = 0
        if (guess.length === 3) multiplier = 3;
        if (guess.length === 4) multiplier = 5;
        if (guess.length === 5) multiplier = 10;
        if (guess.length === 6) multiplier = 15;
        if (guess.length === 7) {
            multiplier = 20;
            passStage = true;
        }

        time += multiplier;
        points += multiplier * 100;
        pointsDiv.innerHTML = points;
    }
}

function clear() {
    guess = "";
    letters = winningWord;
    shuffle();

    displayLetters.innerHTML = letters;
    guessLetters.innerHTML = guess;
}

function shuffle() {
    const arr = letters ? letters.split('') : winningWord.split('');

    for (let i = 0; i < arr.length; i++) {
        let j = Math.floor(Math.random() * arr.length);
        let temp = arr[i]
        arr[i] = arr[j];
        arr[j] = temp;
    }

    letters =  arr.join('');
    displayLetters.innerHTML = letters;
}