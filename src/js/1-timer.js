import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector('.js-button');
const inputEl = document.querySelector('.js-input');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let countdownInterval = null;


startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
        iziToast.error({
            title: 'Error',
            message: 'Please choose a date in the future',
            position: 'topRight',
            timeout: 3000,
          });
      startBtn.disabled = true;
      return;
    }

    userSelectedDate = selectedDate;
    startBtn.disabled = false;
  },
};

flatpickr(inputEl, options);


startBtn.addEventListener('click', () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true; 
  inputEl.disabled = true;

  countdownInterval = setInterval(() => {
    const now = new Date();
    const timeDiff = userSelectedDate - now;

    if (timeDiff <= 0) {
      clearInterval(countdownInterval);
      updateTimerUI(0);
      return;
    }

    updateTimerUI(timeDiff);
  }, 1000);
});


function updateTimerUI(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);
  daysEl.textContent = padZero(days);
  hoursEl.textContent = padZero(hours);
  minutesEl.textContent = padZero(minutes);
  secondsEl.textContent = padZero(seconds);
}


function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor((ms % hour) / minute),
    seconds: Math.floor((ms % minute) / second),
  };
}


function padZero(value) {
  return String(value).padStart(2, '0');
}
