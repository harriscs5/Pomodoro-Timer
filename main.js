const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0,
};

let interval;


// update the countdown with the appropriate amount of minutes and seconds once any of the three buttons above it is clicked.

const buttonSound = new Audio('button-sound.mp3');
const mainButton = document.getElementById('js-btn');
mainButton.addEventListener('click', () => {
    buttonSound.play(); //makes the sound play each time the main button is clicked(start)
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

    if (timer.mode === 'pomodoro') timer.sessions++;
    //this line checks if the current mode is pomodoro and increments the timer.sessions property by 1.



    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');
    //button text changes to “stop” and the button becomes depressed like a hardware button.

    interval = setInterval(function() {
        timer.remainingTime = getRemainingTime(endTime);
        updateClock();
    
        total = timer.remainingTime.total;
        if (total <= 0) {
          clearInterval(interval);

          switch (timer.mode) {
              case 'pomodoro':
                  if (timer.sessions % timer.longBreakInterval === 0) {
                      switchMode('longBreak');
                  } else {
                      switchMode('shortBreak');
                  }
                  break;
                  default:
                      switchMode('pomodoro');
          } //Once the countdown reaches zero, the switch statement causes the app to switch to a new break session or pomodoro session depending on the value of timer.mode

          if (Notification.permission === 'granted') {
            const text =
              timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
              new Notification(text);
        } // ensures that a new notification is displayed when a new session begins. the ternary operator is used to set the text in the notification based on the current state of the timer.


          document.querySelector(`[data-sound="${timer.mode}"]`).play();
          //transition sounds
          //Once a pomodoro session ends and a break session begins, a ringing sound is heard. On the other hand, a “Get back to work” message is played when transitioning to a pomodoro session.

          startTimer();
        }
      }, 1000);
}

function stopTimer() {
    clearInterval(interval);
  
    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
  }

function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');
  
    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;

    const text = timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break';
    document.title = `${minutes}:${seconds} - ${text}`;
    //document .title changes the page title displayed on the browser tab & allows the user to see the remaining time without having to switch browser tabs

    const progress = document.getElementById('js-progress');
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
    //Each time updateClock() is invoked, the value attribute of the <progress> element is updated to the result of the remaining amount of seconds subtracted from the total number of seconds in the session, causing the progress bar to update accordingly.
  }
  
 // this function takes a timestamp and finds the difference between the current time and the end time in milliseconds.
//diff divided (/) by 1000 => converted to integer using Number.parseInt()

function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    };
    //this ensures that the default mode for the timer is pomodoro and the contents of timer.remainingTime is set to the appropriate values for a pomodoro session


    document
        .querySelectorAll('button[data-mode')
        .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;
    document
        .getElementById('js-progress')
        .setAttribute('max', timer.remainingTime.total);

    updateClock();
}


function handleMode(event) {
    const { mode } = event.target.dataset;

    if (!mode) return;

    switchMode(mode);
    stopTimer();
}
//here used event delegation to detect a click on any of the mode buttons
//once mode button click detected  => handleMode() function invoked 

document.addEventListener('DOMContentLoaded', () => {
    // checking if the browser supports notifications
    if ('Notification' in window) {
      // If notification permissions have neither been granted or denied
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        // ask the user for permission
        Notification.requestPermission().then(function(permission) {
          // If permission is granted
          if (permission === 'granted') {
            // Create a new notification
            new Notification(
              'Awesome! You will be notified at the start of each session'
            );
          }
        });
      }
    }
  
    switchMode('pomodoro');
  }); //this allows you to display a notice in your browser asking you to grant notifications permission to the webpage. Ensure to grant this permission before proceeding. Once granted, a test notification will be displayed.