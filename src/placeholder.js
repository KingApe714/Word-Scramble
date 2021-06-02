//loop through game words and set up the placeholders for them.

export function placeHolders(gameWords) {
    const correctEntries = document.querySelector('.correct-entries');
    // const threeLetter = gameWords.filter(word => word.length === 3);
    // const fourLetter = gameWords.filter(word => word.length === 4);
    // const fiveLetter = gameWords.filter(word => word.length === 5);
    // const sixLetter = gameWords.filter(word => word.length === 6);
    // const sevenLetter = gameWords.filter(word => word.length === 7);

    // if (threeLetter.length) correctEntries.appendChild(holders(threeLetter))
    // if (fourLetter.length) correctEntries.appendChild(holders(fourLetter))
    // if (fiveLetter.length) correctEntries.appendChild(holders(fiveLetter))
    // if (sixLetter.length) correctEntries.appendChild(holders(sixLetter))
    // if (sevenLetter.length) correctEntries.appendChild(holders(sevenLetter))
    const obj = {}
    for (let i = 3; i <= 7; i++) {
        obj[i] = gameWords.filter(word => word.length === i)
        if (obj[i].length) correctEntries.appendChild(holders(obj[i]))
    }
}

function holders(arr) {
    if (!arr.length) return null;
    const div = document.createElement("div")
    div.classList.add('words-container')
    for (let i = 0; i < arr.length; i++) {
        let outerDiv = document.createElement('div')
        let innerDiv = document.createElement('div')
        innerDiv.classList.add('hidden-text')
        innerDiv.innerHTML = `${arr[i]}`
        outerDiv.appendChild(innerDiv)
        outerDiv.classList.add('outer-placeholder')
        div.appendChild(outerDiv)
    }
    return div
}