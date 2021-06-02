import game from './game';

export function timer(time) {
    const countdownEl = document.querySelector('.countdown');
    console.log(`time = ${time}`)
    console.log(`countdownEl = ${countdownEl}`)
    if (time) setInterval(updateCountdown, 1000);
    
    function updateCountdown() {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
    
        seconds = seconds < 10 ? '0' + seconds : seconds;
    
        countdownEl.innerHTML = `${minutes}:${seconds}`;
        if (time > 0) time--;
    
        if (time === 0 && passStage) {
            const nextButton = document.createElement('button');
            nextButton.innerText = 'NEXT STAGE';
            modalBg.classList.add('bg-active');
            modalChild.innerHTML = `<div>Get ready for the next stage! total points =  ${points}</div>`
            modalChild.appendChild(nextButton)
            nextButton.addEventListener('click', function() {
                modalBg.classList.remove('bg-active');
                game()
            })
        } else if (time === 0 && !passStage) {
            time = null;
            const restartButtonn = document.createElement('button');
            restartButtonn.innerText = 'RESTART';
            modalBg.classList.add('bg-active');
            modalChild.innerHTML = `<div>GAME OVER! your score = ${points}</div>`
            modalChild.appendChild(restartButtonn)
            restartButtonn.addEventListener('click', function() {
                points = 0;
                modalBg.classList.remove('bg-active');
                game()
            })
        }
    }
}