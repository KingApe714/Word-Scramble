const countdownEl = document.querySelector('.countdown');


setInterval(updateCountdown, 1000);

function updateCountdown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    countdownEl.innerHTML = `${minutes}:${seconds}`;
    time--;

    if (time === 0 && passStage) {
        console.log(passStage)
        game()
    } else if (time === 0 && !passStage) {
        modalBg.classList.add('bg-active');
        modalChild.innerHTML = `GAME OVER! your score = ${points}`
    }
}