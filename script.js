const body = document.querySelector('.body')
const displayLetters = document.querySelector('.shuffled-letters');
const guessLetters = document.querySelector('.guessed-letters');
const correctEntries = document.querySelector('.correct-entries');
const enterButton = document.querySelector('.enter-button');
const shuffleButton = document.querySelector('.shuffle-button');
const clearButton = document.querySelector('.clear-button');

let gameWords;
let globalDictionary = [];
let winningWords = [];
let correctGuesses = [];
let letters = '';
let guess = '';

game()

async function game() {
    await getDictionary()
    const root = new makeNode(null);
    for (const item of globalDictionary)
        add(item, 0, root);
    
    const winningWord = winningWords[Math.floor(Math.random() * winningWords.length)];
    letters = shuffle(winningWord)
    displayLetters.innerHTML = letters;
    gameWords = fetchGameWords(root, winningWord)
    body.addEventListener('keydown', handler)

    shuffleButton.addEventListener('click', function() {
        letters = shuffle(letters)
        displayLetters.innerHTML = letters;
    })

    clearButton.addEventListener('click', function() {
        guess = "";
        letters = shuffle(winningWord)

        displayLetters.innerHTML = letters;
        guessLetters.innerHTML = guess;
    })

    enterButton.addEventListener('click', function() {
        if (gameWords.includes(guess) && !correctGuesses.includes(guess)) {
            correctGuesses.push(guess);
            correctEntries.innerHTML += "<div>" + guess + "</div>";
        }
    })

    console.log(letters)
    console.log(winningWord)
    console.log(gameWords)
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

//this function should honor what the user types if it includes one of the letters of 'letters
//it should also honor when the user deletes
//maybe use a global varialbe that is the users current guess and display it on the screen
//I should probably have a clear button as well
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
        if (gameWords.includes(guess) && !correctGuesses.includes(guess)) {
            correctGuesses.push(guess);
            correctEntries.innerHTML += "<div>" + guess + "</div>";
        }
    }

    displayLetters.innerHTML = letters;
    guessLetters.innerHTML = guess;
    
    console.log(`guess = ${guess}`)
    console.log(`letters = ${letters}`)
}

function shuffle(s) {
    const arr = s.split('');

    for (let i = 0; i < arr.length; i++) {
        let j = Math.floor(Math.random() * arr.length);
        let temp = arr[i]
        arr[i] = arr[j];
        arr[j] = temp;
    }

    return arr.join('');
}