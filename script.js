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
    const gameWords = [];

    //this function needs to be separate as there is likely a recursive call somewhere in here
    
    console.log(root)
    fetchGameWords(root, winningWord)
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

//this function should return the gameWords in an array
function fetchGameWords(tree, string) {
    //lets think of DFSing through the tree and searching for nodes that are .complete
    //then lets focus on just returning the nodes that have exactly the letters in the string that we passed in.
    // console.log(tree.words)
    console.log(string)
    let arr = [];
    
    for (let key in tree.map) {
        // arr.concat(fetchGameWords(tree.map[key], string))
        // console.log(tree.map[key].ch)
        //I need to be inside of this if statement to execute the rest of the code that 
        //I am going to need
        //Now lets focus on dfs down the tree from this point
        if (string.includes(tree.map[key].ch)) {
            console.log(tree.map[key].ch)
            let i = string.indexOf(tree.map[key].ch)
            let otherLetters = string.substring(0, i) + string.substring(i + 1)
            console.log(otherLetters)
            //Maybe I can have a function that returns the words that'll give me all of the 
            //.completes

        }
        if (tree.map[key].complete) {
            let word = fetchWord(tree.map[key])
            console.log(word)
            arr.push(word)
        }
    }
    console.log(arr)

    // console.log('DONE')
    return arr;
}

//this function accepts the tree and the currentNode
//then travel up the parents to then return the currentWord
function fetchWord(currentNode) {
    let nodeCheck = currentNode;
    let word = '';
    // console.log(nodeCheck)
    while(nodeCheck.parent !== null) {
        word = nodeCheck.ch + word;
        nodeCheck = nodeCheck.parent;
    }

    return word;
}

//If I break the word down into its fragments and only check the paths that actually have children then I will be building
//a tree but strictly with the possibilities that I want to look for.
//So the tree building is actually extremely useful

//I need to do a DFS on each of the passing letters and once I reach a letter that has a .complete I return that word
//into the array.





// if (string.length === 0) {
//     return
// }

// let gameWords = [];
// // console.log(string)
// for (let i in string) {
//     let chr = string[i];
//     let otherLetters = string.substring(0, i) + string.substring(i + 1)
//     //I wanna check for the children of chr that are exactly the other chrs in winningWord
//     let subTree = tree.map[chr]
//     console.log(subTree)
//     if (subTree.complete) {
//         gameWords.concat(subTree.words)
//         console.log('passed test')
//         console.log(subTree.words)
//     }
//     console.log(gameWords)
//     let test = fetchGameWords(subTree, otherLetters)
//     console.log(test)
//     // for (let i in otherLetters) {
//     //     if (subTree.map[otherLetters[i]]) {
//     //         console.log(subTree.map[otherLetters[i]])
//     //     }
//     // }
//     console.log('___________________')
// }
// return gameWords;