import "./styles.css";

const breakIncrementBtn = document.getElementById("break-increment");
const breakDecrementBtn = document.getElementById("break-decrement");

const sessionIncremBtn = document.getElementById("session-increment");
const sessionDecremBtn = document.getElementById("session-decrement");

const playPauseBtn = document.getElementById("start_stop");
const resetBtn = document.getElementById("reset");

const textBreak = document.getElementById("break-length");
const textSession = document.getElementById("session-length");
const display = document.getElementById("time-left");
const nameLabel = document.getElementById("timer-label");
const audioBeep = document.getElementById("beep");

breakIncrementBtn.addEventListener("click", increaseBreak);
breakDecrementBtn.addEventListener("click", decreaseBreak);
sessionIncremBtn.addEventListener("click", increaseSession);
sessionDecremBtn.addEventListener("click", decreaseSession);
resetBtn.addEventListener("click", reset);
playPauseBtn.addEventListener("click", start_stop);

let isCounting = false;
let breakDefaultLen = "5";
let sessionDefaultLen = "25";
let countdown;
let seconds;
let secondsElapsed;
let breakTime = false;

//set break buttons up and down
function increaseBreak(e) {
  let mins = parseInt(textBreak.innerText);
  if (isCounting === false) {
    if (mins < 60) {
      mins = mins + 1;
    }
  }
  textBreak.dataset.time = mins * 60;
  textBreak.innerText = `${mins}`;
  if (
    breakTime === true &&
    isCounting === false &&
    nameLabel.innerText === "Break"
  ) {
    display.innerText = `${mins < 10 ? "0" : ""}${mins}:00`;
  }
}

function decreaseBreak(e) {
  let mins = parseInt(textBreak.innerText);
  if (isCounting === false) {
    if (mins > 1) {
      mins = mins - 1;
    }
  }
  textBreak.dataset.time = mins * 60;
  textBreak.innerText = `${mins}`;
  if (
    breakTime === true &&
    isCounting === false &&
    nameLabel.innerText === "Break"
  ) {
    display.innerText = `${mins < 10 ? "0" : ""}${mins}:00`;
  }
}

//set session btn up and down
function increaseSession(e) {
  let mins = parseInt(textSession.innerText);
  if (isCounting === false) {
    if (mins < 60) {
      mins = mins + 1;
    }
    textSession.dataset.time = mins * 60;
    textSession.innerText = `${mins}`;
    if (isCounting === false && nameLabel.innerText !== "Break") {
      updateDisplay();
    }
  }
}

function decreaseSession(e) {
  let mins = parseInt(textSession.innerText);
  if (isCounting === false) {
    if (mins > 1) {
      mins = mins - 1;
    }
    textSession.dataset.time = mins * 60;
    textSession.innerText = `${mins}`;
    if (isCounting === false && nameLabel.innerText !== "Break") {
      updateDisplay();
    }
  }
}

function updateDisplay() {
  let minDisplay = parseInt(textSession.innerText);
  display.innerText = `${minDisplay < 10 ? "0" : ""}${minDisplay}:00`;
}

//back to default
function reset(e) {
  clearInterval(countdown);
  textBreak.innerText = breakDefaultLen;
  textSession.innerText = sessionDefaultLen;
  textSession.dataset.time = parseInt(textSession.innerText) * 60;
  textBreak.dataset.time = parseInt(textBreak.innerText) * 60;
  nameLabel.innerText = "Session";
  audioBeep.currentTime = 0;
  audioBeep.src = "";
  isCounting = false;
  breakTime = false;
  displayDefault();
}

function displayDefault() {
  display.innerText = `${sessionDefaultLen}:00`;
  audioBeep.src =
    "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg";
}

//timer

function start_stop(e) {
  isCounting = !isCounting;
  if (isCounting === true && breakTime === false) {
    startTimer(seconds);
  }

  if (isCounting === true && breakTime === true) {
    startBreak(seconds);
  }

  if (isCounting === false) {
    pauseTimer(seconds);
  }
}

function startTimer() {
  isCounting = true;
  breakTime = false;
  seconds = parseInt(textSession.dataset.time);

  let now = Date.now(); //in ms
  const then = now + seconds * 1000;
  countdown = setInterval(() => {
    secondsElapsed = Math.round((then - Date.now()) / 1000);
    textSession.dataset.time = secondsElapsed;
    displayTimeLeft(secondsElapsed);
    if (secondsElapsed === 0) {
      audioBeep.play();
      clearInterval(countdown);
      textSession.dataset.time = parseInt(textSession.innerText) * 60;
      setTimeout(() => {
        nameLabel.innerText = "Break";
        display.innerText = `${parseInt(textBreak.innerText) < 10 ? "0" : ""}${
          textBreak.innerText
        }:00`;
        startBreak();
      }, 500);
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(countdown);
}

function startBreak() {
  isCounting = true;
  breakTime = true;
  seconds = parseInt(textBreak.dataset.time);
  let now = Date.now();
  const then = now + seconds * 1000;
  countdown = setInterval(() => {
    secondsElapsed = Math.round((then - Date.now()) / 1000);
    textBreak.dataset.time = secondsElapsed;
    displayTimeLeft(secondsElapsed);
    if (secondsElapsed === 0) {
      audioBeep.play();
      clearInterval(countdown);
      textBreak.dataset.time = parseInt(textBreak.innerText) * 60;
      setTimeout(() => {
        nameLabel.innerText = "Session";
        display.innerText = `${
          parseInt(textSession.innerText) < 10 ? "0" : ""
        }${textSession.innerText}:00`;
        startTimer();
      }, 500);
    }
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const reminderSeconds = seconds % 60;
  const displayTimeLen = `${minutes < 10 ? "0" : ""}${minutes}:${
    reminderSeconds < 10 ? "0" : ""
  }${reminderSeconds}`;
  display.innerText = displayTimeLen;
}
