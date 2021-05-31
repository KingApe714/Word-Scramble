const modalBtn = document.querySelector('.modal-button');
const modalBg = document.querySelector('.modal-bg');
const modalClose = document.querySelector('.modal-close');
const modalChild = document.querySelector('.modal-child');
const strText = modalChild.textContent;
const splitText = strText.split(' ');
modalChild.textContent = "";

for (let i = 0; i < splitText.length; i++) {
    modalChild.innerHTML += "<span class='letter'>" + splitText[i] + "</span>";
    modalChild.innerHTML += "&nbsp;"
}

modalBtn.addEventListener('click', function() {
    modalBg.classList.add('bg-active');
    
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