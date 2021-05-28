const modalBtn = document.querySelector('.modal-button');
const modalBg = document.querySelector('.modal-bg');
const modalClose = document.querySelector('.modal-close');
const instructions = document.querySelector('.instructions')
const text = document.querySelector('.instructions');
const strText = text.textContent;
const splitText = strText.split(' ');
text.textContent = "";

for (let i = 0; i < splitText.length; i++) {
    text.innerHTML += "<span class='letter'>" + splitText[i] + "</span>";
    text.innerHTML += "&nbsp;"
}

modalBtn.addEventListener('click', function() {
    modalBg.classList.add('bg-active');
    
    let char = 0;
    let timer = setInterval(onTick, 50);
    
    function onTick() {
        const span = text.querySelectorAll('.letter')[char];
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

let globalDictionary = [];
let winningWords = [];
let input = "";

game()

async function game() {
    await getDictionary()
    const root = new makeNode(null);
    for (const item of globalDictionary)
        add(item, 0, root);
        
    const winningWord = winningWords[Math.floor(Math.random() * winningWords.length)];
    let shuffledLetters = shuffle(winningWord);
    //set up the game words using the characters of the winning word.
    const gameWords = fetchGameWords(root, winningWord)
    const displayLetters = document.querySelector('.shuffled-letters');
    displayLetters.innerHTML = shuffledLetters;
    
    const shuffleButton = document.querySelector('.shuffle-button')
    shuffleButton.addEventListener('click', function() {
        shuffledLetters = shuffle(winningWord)
        displayLetters.innerHTML = shuffledLetters;
    })
    const text_box = document.getElementById('text-box');
    text_box.addEventListener('keydown', handler)

    console.log(shuffledLetters)
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

function handler(e) {
    const str = e.target.value;
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    if (alphabet.includes(str[str.length - 1]))
    input = str.toUpperCase()
    console.log(input)
    console.log(str)
}