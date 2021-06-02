import { makeNode, add, fetchGameWords } from './trie.js'
import { placeHolders } from './placeholder.js'
// import { modal } from './instructions.js'
import { howl } from 'howler';

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


async function game() {
    const modalBtn = document.querySelector('.modal-button');
    const modalBg = document.querySelector('.modal-bg');
    const modalClose = document.querySelector('.modal-close');
    const modalChild = document.querySelector('.modal-child');
    const strText = modalChild.textContent;
    const splitText = strText.split(' ');
    modalChild.textContent = "";
    modalBtn.addEventListener('click', function() {
        modalBg.classList.add('bg-active');
        modalChild.innerHTML = 'Make as many words as you can within the alotted time to get the highest score! Find the longest word to move onto the next stage!'
        for (let i = 0; i < splitText.length; i++) {
            modalChild.innerHTML += "<span class='letter'>" + splitText[i] + "</span>";
            modalChild.innerHTML += "&nbsp;"
        }
        let char = 0;
        let timer = setInterval(onTick, 50);
        
        function onTick() {
            const span = modalChild.querySelectorAll('.letter')[char];
            if (span) span.classList.add('fade');
            char++;
            if (char === splitText.length) {
                complete();
                return;
            }
        }
        
        function complete() {
            clearInterval(timer);
            timer = null;
        }
        
    })
    modalClose.addEventListener('click', function() {
        modalBg.classList.remove('bg-active');
    })

    const body = document.querySelector('.body')
    const guessLetters = document.querySelector('.guessed-letters');
    const displayLetters = document.querySelector('.shuffled-letters');
    const correctEntries = document.querySelector('.correct-entries');
    const enterButton = document.querySelector('.enter-button');
    const shuffleButton = document.querySelector('.shuffle-button');
    const clearButton = document.querySelector('.clear-button');
    const pointsDiv = document.querySelector('.points');
    const remainingWordsDiv = document.querySelector('.remaining-words')
    
    
    await getDictionary()
    const root = new makeNode(null);
    for (const item of globalDictionary)
        add(item, 0, root);

    const startingMinutes = 2;
    time = startingMinutes * 60;
    
    correctGuesses = [];
    passStage = false;
    guess = ''
    letters = null;
    winningWord = winningWords[Math.floor(Math.random() * winningWords.length)];
    gameWords = fetchGameWords(root, winningWord)
    passWords = gameWords.filter(word => word.length === 7)
    
    timer()
    shuffle()
    
    console.log(displayLetters)
    console.log(guessLetters)
    console.log(body)

    displayLetters.innerHTML = letters;
    guessLetters.innerHTML = guess;
    remainingWordsDiv.innerHTML = gameWords.length;
    pointsDiv.innerHTML = points;
    correctEntries.innerHTML = '';

    placeHolders(gameWords)
    
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

function timer() {
    const countdownEl = document.querySelector('.countdown');
    console.log(`time = ${time}`)
    console.log(`countdownEl = ${countdownEl}`)
    if (time) setInterval(updateCountdown, 1000);
    
    function updateCountdown() {
        const modalBg = document.querySelector('.modal-bg');
        const modalChild = document.querySelector('.modal-child');
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
    
        seconds = seconds < 10 ? '0' + seconds : seconds;
    
        countdownEl.innerHTML = `${minutes}:${seconds}`;
        if (time > 0) time--;
    
        if (time === 0 && passStage) {
            const nextButton = document.createElement('button');
            nextButton.innerText = 'NEXT STAGE';
            modalBg.classList.add('bg-active');
            modalChild.innerHTML = `<div>Get ready for the next stage! total points =  ${points}</div>`
            modalChild.appendChild(nextButton)
            nextButton.addEventListener('click', function() {
                modalBg.classList.remove('bg-active');
                game()
            })
        } else if (time === 0 && !passStage) {
            time = null;
            const restartButtonn = document.createElement('button');
            restartButtonn.innerText = 'RESTART';
            modalBg.classList.add('bg-active');
            modalChild.innerHTML = `<div>GAME OVER! your score = ${points}</div>`
            modalChild.appendChild(restartButtonn)
            restartButtonn.addEventListener('click', function() {
                points = 0;
                modalBg.classList.remove('bg-active');
                game()
            })
        }
    }
}

function handler(e) {
    const guessLetters = document.querySelector('.guessed-letters');
    const displayLetters = document.querySelector('.shuffled-letters');
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
    const remainingWordsDiv = document.querySelector('.remaining-words')
    const correctEntries = document.querySelector('.correct-entries');
    const pointsDiv = document.querySelector('.points');

    if (gameWords.includes(guess) && !correctGuesses.includes(guess)) {
        correctGuesses.push(guess);
        correctEntries.childNodes.forEach(node => {
            node.childNodes.forEach(innerNode => {
                if (innerNode.firstChild.innerHTML === guess) {
                    innerNode.firstChild.classList.remove('hidden-text')
                }
            })
        })
        
        remainingWordsDiv.innerHTML = gameWords.length - correctGuesses.length;

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
    // displayLetters.innerHTML = letters;
}

export default game