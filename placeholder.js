//loop through game words and set up the placeholders for them.

function placeHolders() {
    const threeLetter = holders(gameWords.filter(word => word.length === 3));
    const fourLetter = holders(gameWords.filter(word => word.length === 4));
    const fiveLetter = holders(gameWords.filter(word => word.length === 5));
    const sixLetter = holders(gameWords.filter(word => word.length === 6));
    const sevenLetter = holders(gameWords.filter(word => word.length === 7));

    correctEntries.appendChild(threeLetter)
    correctEntries.appendChild(fourLetter)
    correctEntries.appendChild(fiveLetter)
    correctEntries.appendChild(sixLetter)
    correctEntries.appendChild(sevenLetter)
}

function holders(arr) {
    let dashes = ''
    for (j = 0; j < arr[0].length; j++) {
        dashes += '_'
    }
    const div = document.createElement("div")
    for (let i = 0; i < arr.length; i++) {
        div.innerHTML += `<div>${dashes}</div>`
    }
    return div
}