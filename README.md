# Word-Scramble
A game inspired by word twist. Users can choose to either click on the letter bubbles or type the letters to start
the spelling of a word. User must find one of the 7 letter words in order to move onto the next stage. As words are 
found they are populated in the clue container that sits underneath it.

# Technologies

* Vanilla Javascript
* HTML/CSS

# Development

**Word Selection**

A 200,000+ word dictionary is first parsed down to only use words of length 3 to 7. Then the new library of words is
stored in a Trie Tree for later retreival. A 7 letter word is randomly selected from the library and a new algorithm
is run using the Trie Tree to specifically grab words that can be made with the letters from the 7 letter word.

```javascript
export function fetchGameWords(tree, string) {
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
```

**Discovered Words**

As words are discovered they become visible to the user in the clue container which are all hinted via a list of 
underscores. Points and time bonuses are awarded for each word depending on the length of the word

![guess container image](https://user-images.githubusercontent.com/74022542/142081949-3eb4ad71-fb8e-4c41-8386-121e23920d94.png)

**Side Panel**

Users can click on the side panel revealing the key board free option for playing the game. Instead of typing
and having the word fragment appear in the guess container, users click on the bubbles, click on the shuffle
button in the side container, delete from the fragment and can clear the word fragment from the guess container.

![Side Panel Image](https://user-images.githubusercontent.com/74022542/142082547-d02b5c71-31f0-4a93-9e92-1410009c568e.png)

**End Game Modal**

If the user has found at least one seven letter word then they are notified in the end game modal and are allowed to move onto
the next stage. Otherwise they are only allowed to restart and see a game over screen.

![end game modal image](https://user-images.githubusercontent.com/74022542/142083195-fe9409d7-8cb6-446c-9f03-c301e9ea799d.png)
