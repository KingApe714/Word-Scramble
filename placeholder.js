//loop through game words and set up the placeholders for them.

function placeHolders() {
    const threeLetter = gameWords.filter(word => word.length === 3);
    const fourLetter = gameWords.filter(word => word.length === 4);
    const fiveLetter = gameWords.filter(word => word.length === 5);
    const sixLetter = gameWords.filter(word => word.length === 6);
    const sevenLetter = gameWords.filter(word => word.length === 7);

    if (threeLetter.length) correctEntries.appendChild(holders(threeLetter))
    if (fourLetter.length) correctEntries.appendChild(holders(fourLetter))
    if (fiveLetter.length) correctEntries.appendChild(holders(fiveLetter))
    if (sixLetter.length) correctEntries.appendChild(holders(sixLetter))
    if (sevenLetter.length) correctEntries.appendChild(holders(sevenLetter))
}

function holders(arr) {
    if (!arr.length) return null;
    let dashes = ''
    for (j = 0; j < arr[0].length; j++) {
        dashes += '-'
    }
    const div = document.createElement("div")
    for (let i = 0; i < arr.length; i++) {
        div.innerHTML += `<div>${dashes}</div>`
    }
    return div
}