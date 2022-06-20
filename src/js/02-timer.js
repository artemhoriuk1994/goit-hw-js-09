import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix';

const refs = {
  dateInput: document.querySelector('input#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.setAttribute('disabled', true);
refs.startBtn.addEventListener('click', startСountdownTimer);

let selectedDate = null;
let currentDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    renderСountdownTimer(0);
    clearInterval(timerId);

    selectedDate = selectedDates[0];
    currentDate = new Date();

    if (selectedDate <= currentDate) {
      Notify.failure('Please choose a date in the future');
      return;
    }

    refs.startBtn.disabled = false;
  },
};

flatpickr(refs.dateInput, options);

function startСountdownTimer() {
  timerId = setInterval(() => {
    currentDate = new Date();
    if (selectedDate <= currentDate) {
      clearInterval(timerId);
      return;
    }
    const remainingTime = selectedDate - currentDate;
    renderСountdownTimer(remainingTime);
  }, 1000);

  refs.startBtn.disabled = true;
}

function renderСountdownTimer(time) {
  const { days, hours, minutes, seconds } = convertMs(time);

  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
