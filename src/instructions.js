const modalBtn = document.querySelector('.modal-button');
const modalBg = document.querySelector('.modal-bg');
const modalClose = document.querySelector('.modal-close');
const modalChild = document.querySelector('.modal-child');
const strText = modalChild.textContent;
const splitText = strText.split(' ');
modalChild.textContent = "";

export function modal() {
    modalBtn.addEventListener('click', function() {
        modalBg.classList.add('bg-active');
        modalChild.innerHTML = 'Make as many words as you can within the alotted time to get the highest score! Find the longest word to move onto the next stage!'
        for (let i = 0; i < splitText.length; i++) {
            modalChild.innerHTML += "<span class='letter'>" + splitText[i] + "</span>";
            modalChild.innerHTML += "&nbsp;"
        }
        let char = 0;
        let timer = setInterval(onTick, 50);
        
        function onTick() {
            const span = modalChild.querySelectorAll('.letter')[char];
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
}