export function placeHolders(gameWords) {
    const correctEntries = document.querySelector('.correct-entries');
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