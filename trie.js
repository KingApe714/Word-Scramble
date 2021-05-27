function makeNode(ch) {
    this.ch = ch;
    this.complete = false;
    this.map = {};
    this.parent = null;
    this.words = [];
}

function add(str, i, root) {
    if (i === str.length) {
        root.complete = true;
        return
    }

    if (!root.map[str[i]]) {
        root.map[str[i]] = new makeNode(str[i])
        root.map[str[i]].parent = root;
    }

    root.words.push(str);
    add(str, i + 1, root.map[str[i]]);
}

function search(str, i, root) {
    if (i === str.length) 
        return root.words;

    if (!root.map[str[i]])
        return [];
    
    return search(str, i+1, root.map[str[i]]);
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