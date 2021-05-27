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

let globalDictionary = []
let winningWords = []

let testDictionary = []

test()

async function test() {
    await getDictionary()
    const root = new makeNode(null);
    for (const item of globalDictionary)
        add(item, 0, root);
        
    const winningWord = winningWords[Math.floor(Math.random() * winningWords.length)];
    
    //set up the game words using the characters of the winning word.
    const gameWords = fetchGameWords(root, winningWord)
    // console.log(winningWord)
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

function fetchGameWords(tree, string) {
    let gameWords = []
    const queue = [[tree, string]];
    while (queue.length) {
        //lets grab the first element of the queue
        let ele = queue.shift()
        for (let i = 0; i < ele[1].length; i++) {
            if (ele[0].complete) {
                let currentWord = fetchWord(ele[0]);
                if (!gameWords.includes(currentWord)) {
                    gameWords.push(currentWord)
                }
            }
            let char = ele[1][i]
            let subTree = ele[0];
            if (subTree.map[char]) {
                subTree = subTree.map[char]
                let idx = ele[1].indexOf(char);
                let otherLetters = ele[1].substring(0, idx) + ele[1].substring(idx + 1);
                //need to give otherLetters something to later iterate through
                otherLetters = otherLetters ? otherLetters : " "
                queue.push([subTree, otherLetters])
            }
        }
    }
    return gameWords
}

//this function accepts the currentNode
//then travel up the parents to then return the currentWord
function fetchWord(currentNode) {
    let nodeCheck = currentNode;
    let word = '';
    while(nodeCheck.parent !== null) {
        word = nodeCheck.ch + word;
        nodeCheck = nodeCheck.parent;
    }
    
    return word;
}