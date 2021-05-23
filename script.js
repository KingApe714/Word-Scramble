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

// const fetchDictionary = fetch('dictionary.txt')
//     .then(res => {
//         // console.log(res)
//         return res.text();
//     })
//     .then(data => {
//         // console.log(data);
//         return data;
//     })
const test = async () => {
    const a = await fetchDictionary;
    // const b = await a;
    // console.log(a)
    // console.log(a)
    return a
}

// const fetchWords = () => (
//     fetch('dictionary.txt')
// )

// const receiveDictionary = (dictionary) => ({
//     dictionary
// })

// const fetchDictionary = () => dispatch => {
    
//     return fetchWords()
//         .then(words => dispatch(receiveDictionary(words)))
// }

// let test1 = fetchDictionary()

let stuff, k;
// console.log(test1())
async function otherTest() {
    const a = await fetch('dictionary.txt')
    const data = await a.text();
    // console.log(data)

    stuff = data;

    let event = new Event("test", { bubbles: true });
    let k = document.dispatchEvent(event);
    console.log(k)
    return data
}
// console.log(otherTest())
otherTest();

let flag = false;
let tester;

addEventListener("test", function(){
    flag = true;
    // console.log(fetch('dictionary.txt'))
    // alert("pishglang")
    // return (fetch('dictionary.txt'))
    // console.log(tester)
})

setTimeout( ()=> 
{
    if( flag ){
        console.log(stuff); 
    }
},0);



console.log(stuff)

// let event = new Event("test", {bubbles: true})

// let k = document.dispatchEvent(event)


console.log(k)

function one(){

}
function two(){


}

