import { makeNode, add, fetchGameWords } from './trie.js'
import { placeHolders } from './placeholder.js'
import { Howl, Howler } from 'howler';

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
let gameLetters = {}
let positions = []


async function game() {

    //Handle the music functionality
    const playMusic = document.querySelector('.play-music');
    const pauseMusic = document.querySelector('.pause-music');
    
    let music = null;
    playMusic.addEventListener('click', function() {
        if (music != null) {
            music.stop();
            music.unload();
            music = null;
        }
        music = new Howl({
            src: ['../sounds/bensound-ukulele.mp3']
        });
        music.play();
    })

    pauseMusic.addEventListener('click', function() {
        music.stop()
        music.unload()
        music = null;
    })
    //End of music

    //Handle modal with instructions
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
        let t = setInterval(onTick, 50);
        
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
            clearInterval(t);
            t = null;
        }
        
    })
    modalClose.addEventListener('click', function() {
        modalBg.classList.remove('bg-active');
    })
    //end modal with instructions

    //start side panel functionality
    const panelButton = document.querySelector('.panel-button')
    const sidePanel = document.querySelector('.sidepanel')
    const panelClose = document.querySelector('.panel-close')

    panelClose.addEventListener('click', function() {
        sidePanel.style.width = '0px';
    })

    panelButton.addEventListener('click', function() {
        sidePanel.style.width = '150px';
    })
    //end side panel functionality

    //select relevant divs and buttons
    const body = document.querySelector('.body')
    const guessLetters = document.querySelector('.guessed-letters');
    const displayLetters = document.querySelector('.shuffled-letters');
    const correctEntries = document.querySelector('.correct-entries');
    const enterButton = document.querySelector('.enter-button');
    const shuffleButton = document.querySelector('.shuffle-button');
    const clearButton = document.querySelector('.clear-button');
    const pointsDiv = document.querySelector('.points');
    const remainingWordsDiv = document.querySelector('.remaining-words')

    //set up trie tree with all of the words in the dictionary
    await getDictionary()
    const root = new makeNode(null);
    for (const item of globalDictionary)
        add(item, 0, root);

    //set up timer that will countdown
    const startingMinutes = 2;
    time = startingMinutes * 60;
    
    //grab all relevant game words
    correctGuesses = [];
    passStage = false;
    guess = ''
    letters = null;
    winningWord = winningWords[Math.floor(Math.random() * winningWords.length)];
    gameWords = fetchGameWords(root, winningWord)
    passWords = gameWords.filter(word => word.length === 7)

    //set up the display of relevant game rendering
    displayLetters.innerHTML = letters;
    guessLetters.innerHTML = guess;
    remainingWordsDiv.innerHTML = gameWords.length;
    pointsDiv.innerHTML = points;
    correctEntries.innerHTML = '';
    
    //set up the underscores
    placeHolders(gameWords)
    
    //make entire body listen for the users typing
    body.addEventListener('keydown', handler)
    
    //set up actions for all of the game buttons
    shuffleButton.addEventListener('click', function() {
        shuffle()
    })
    
    clearButton.addEventListener('click', function() {
        clear()
    })
    
    enterButton.addEventListener('click', function() {
        entries();
    })
    timer()
    shuffle()
    
    gameLetters = {}

    //set up all of the game letter bubbles and their functionality
    //I am trying to clear out whatever is in these containers to then set them up with new letters
    //this is what I believe is currently breaking my next stage setup
    const lettersContainer = document.querySelector('.letters-container')
    lettersContainer.childNodes.forEach(n => lettersContainer.remove(n))

    const guessContainer = document.querySelector('.guess-container')
    guessContainer.childNodes.forEach(n => guessContainer.remove(n))

    for (let i = 0; i < letters.length; i++) {
        let currentDiv = document.createElement('div');
        currentDiv.innerHTML = letters[i];
        currentDiv.className = 'game-letter'
        //I need to change the styling of this letter bubble
        currentDiv.style.left = i * 120 + 'px';
        currentDiv.addEventListener('click', function() {
            //move the bubble from guessContainer to the lettersContainer
            if (gameLetters[i].selected) {
                // currentDiv.style.left = lettersContainer.children.length * 120 + 'px';
                guessContainer.removeChild(currentDiv)
                lettersContainer.appendChild(currentDiv)
                gameLetters[i].selected = false;
                //move the bubble from lettersContainer to the guessContainer
            } else {
                // currentDiv.style.left = guessContainer.children.length * 120 + 'px';
                lettersContainer.removeChild(currentDiv)
                guessContainer.appendChild(currentDiv)
                gameLetters[i].selected = true;
            }
            resetContainer(guessContainer)
            resetContainer(lettersContainer)
        })
        gameLetters[i] = {
            char: letters[i],
            div: currentDiv,
            selected: false
        }
        lettersContainer.appendChild(currentDiv)
    }
}

//make all bubbles move to the left to compensate for the letter that was clicked
function resetContainer(currentContainer) {
    for (let i = 0; i < currentContainer.children.length; i++) {
        let child = currentContainer.children[i];
        child.style.left = i * 120 + 'px';
    }
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

//function for counter and what happens at the end of the countdown
function timer() {
    const countdownEl = document.querySelector('.countdown');
    let t = setInterval(updateCountdown, 1000);
    
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
                clearInterval(t)
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
                clearInterval(t)
                points = 0;
                modalBg.classList.remove('bg-active');
                game()
            })
        }
    }
}

//in this function I have to focus on refactoring some of the logic
function handler(e) {
    const guessLetters = document.querySelector('.guessed-letters');
    const displayLetters = document.querySelector('.shuffled-letters');

    const lettersContainer = document.querySelector('.letters-container')
    const guessContainer = document.querySelector('.guess-container')
    const str = e.key.toUpperCase();
    
    //now I know that the user has clicked on a letter that is available
    if (letters.includes(str)) {
        let idx = letters.indexOf(str)
        letters = letters.slice(0, idx) + letters.slice(idx + 1);
        guess += str;

        for (let key in gameLetters) {
            if (gameLetters[key].char === str) {
                if (!gameLetters[key].selected) {
                    lettersContainer.removeChild(gameLetters[key].div)
                    //set all letters in lettersContainer to the left when letter is used
                    for (let i = 0; i < lettersContainer.children.length; i++) {
                        lettersContainer.children[i].style.left = i * 120 + 'px';
                    }
                    gameLetters[key].div.style.left = guessContainer.children.length * 120 + 'px';
                    gameLetters[key].selected = true;
                    guessContainer.appendChild(gameLetters[key].div)
                    break;
                }
            }
        }
        playSound('type.wav')
    }
    if (str === "BACKSPACE" && guess.length) {
        let char = guess[guess.length - 1]
        guess = guess.slice(0, guess.length - 1)
        if (char) letters += char;

        for (let key in gameLetters) {
            if (gameLetters[key].char === guessContainer.lastElementChild.innerHTML) {
                gameLetters[key].selected = false;
            }
        }

        guessContainer.lastElementChild.style.left = lettersContainer.children.length * 120 + 'px';
        lettersContainer.appendChild(guessContainer.lastElementChild)
    } else if (str === "ENTER") {
        entries()
    } else if (str === "/") {
        clear()
    } else if (str === "SHIFT") {
        shuffle()
    }
    
    displayLetters.innerHTML = letters;
    guessLetters.innerHTML = guess;
}

function guessEntry() {

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
                    playSound(`sound${guess.length}.wav`)
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

function playSound(file) {
    let sound = new Howl({
        src: [`../sounds/${file}`]
    })
    sound.play();
}

//I need for this to update my gameLetters object
function clear() {
    const displayLetters = document.querySelector('.shuffled-letters')
    const guessLetters = document.querySelector('.guessed-letters')
    guess = "";
    const guessContainer = document.querySelector('.guess-container')
    const lettersContainer = document.querySelector('.letters-container')
    
    //remove all letter bubbles from guess container to letters container
    while (guessContainer.children.length) {
        letters += guessContainer.firstElementChild.innerHTML;
        lettersContainer.appendChild(guessContainer.firstElementChild)
    }
    //ensure all letter bubbles are styled properly
    for (let i = 0; i < lettersContainer.children.length; i++) {
        lettersContainer.children[i].style.left = i * 120 + 'px';
    }
    
    for (let key in gameLetters) {
        gameLetters[key].selected = false;
    }
    displayLetters.innerHTML = letters;
    guessLetters.innerHTML = guess;
}

let firstShuffle = true;
function shuffle() {
    const displayLetters = document.querySelector('.shuffled-letters')
    let arr;
    if (firstShuffle) {
        arr = winningWord.split('')
        firstShuffle = false;
    } else {
        arr = letters.split('')
    }
    let gameLetters = [...document.querySelector('.letters-container').children]

    for (let i = 0; i < arr.length; i++) {
        let j = Math.floor(Math.random() * arr.length);
        let temp = arr[i]
        arr[i] = arr[j];
        arr[j] = temp;
    }

    arr.forEach((char, idx) => {
        //now lets grab the letters that match char
        for (let i = 0; i < gameLetters.length; i++){
            if (gameLetters[i].innerHTML === char) {
                gameLetters[i].style.left = 120 * idx + 'px';
                gameLetters = gameLetters.slice(0, i).concat(gameLetters.slice(i + 1))
                break
            }
        }
    })
    letters =  arr.join('');
    // console.log(`letters = ${letters}`)
    displayLetters.innerHTML = letters;
}

export default game