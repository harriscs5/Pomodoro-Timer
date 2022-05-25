const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
};

let interval;


// update the countdown with the appropriate amount of minutes and seconds once any of the three buttons above it is clicked.

const mainButton = document.getElementById('js-btn');
mainButton.addEventListener('click', () => {
    const { action } = mainButton.dataset;
    if (action === 'start') {
        startTimer();
    } else {
        stopTimer();
    }
});
//Once the main button is clicked, the value of the data-action attribute on the button is stored in an action variable and checked to see if it’s equal to “start”. If so, the startTimer() function is invoked and the countdown begins.

const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);

function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;
  
    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);
  
    return {
      total,
      minutes,
      seconds,
    };
  }
  // function above takes a timestamp argument and finds the difference between the current time and the end time in milliseconds


function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');
    //button text changes to “stop” and the button becomes depressed like a hardware button.

function stopTimer() {
    clearInterval(interval);
      
    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
  }
  //In this function, the clearInterval() method is invoked, causing the setInterval() method triggered in startTimer() to be cancelled so that the countdown is paused.
  //The value of the button’s data-action attribute and its text content is changed to “start” and it is returned to its original form by removing the active class.


  
    interval = setInterval(function() {
      timer.remainingTime = getRemainingTime(endTime);
      updateClock();
  
      total = timer.remainingTime.total;
      if (total <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }
  

function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');
  
    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;
  }
  
 // this function takes a timestamp and finds the difference between the current time and the end time in milliseconds.
//diff divided (/) by 1000 => converted to integer using Number.parseInt()


  //this ensures that the default mode for the timer is pomodoro and the contents of timer.remainingTime is set to the appropriate values for a pomodoro session

function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    };

    document
        .querySelectorAll('button[data-mode')
        .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;

    updateClock();
}


function handleMode(event) {
    const { mode } =event.target.dataset;

    if (!mode) return;

    switchMode(mode);
    stopTimer();
}
//here used event delegation to detect a click on any of the mode buttons
//once mode button click detected  => handleMode() function invoked 

document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
  });