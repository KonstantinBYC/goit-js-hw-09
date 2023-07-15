import flatpickr from 'flatpickr';
import { Report } from 'notiflix/build/notiflix-report-aio';
// Додатковий імпорт стилів
import 'flatpickr/dist/themes/dark.css';

// select picker and button
const datePicker = document.querySelector('#datetime-picker');
const btnStart = document.querySelector('button[data-start]');

// adding placeholder in datePicker(input)
datePicker.setAttribute('placeholder', 'Choose required date');

// disabled Start button if date is not chosen
btnStart.setAttribute('disabled', 'disabled');

// adding Reset button
const createBtn = document.createElement('button');
const resetBtn = btnStart.insertAdjacentElement('afterend', createBtn);

// Reset button atributes
resetBtn.textContent = 'Reset';
resetBtn.setAttribute('type', 'button');
resetBtn.setAttribute('data-reset', '');
resetBtn.classList.add('button');
resetBtn.classList.add('is-hidden');

const options = {
  //   minDate: new Date(),
  enableTime: true,
  time_24hr: true,
  //   defaultDate: new Date(),
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    // console.log(selectedDates[0]);
    const currentTime = Date.now();
    // If date chosen correct the Button "Start" become available.
    if (selectedDates[0].getTime() < currentTime) {
      Report.info('От халепа!', 'Please choose a date in the future');
    } else {
      btnStart.removeAttribute('disabled');
    }
  },
};

// add calendar to Input
flatpickr('#datetime-picker', options);

// get links of spans
const reversTimerComponents = {
  getDays: document.querySelector('span[data-days]'),
  getHours: document.querySelector('span[data-hours]'),
  getMinutes: document.querySelector('span[data-minutes]'),
  getSeconds: document.querySelector('span[data-seconds]'),
};

// convert msec to Date
function convertMs(ms) {
  // number of ms per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // remaining days
  const days = Math.floor(ms / day);
  // remaining hours
  const hours = Math.floor((ms % day) / hour);
  // remaining mins
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // remaining secs
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// adding 0 to start if amount of figures less then 2.
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// creating Functionality of reverse Timer
btnStart.addEventListener('click', onClickStartTimer);

let intervalId = null;

function onClickStartTimer() {
  intervalId = setInterval(updCounter, 1000);

  function updCounter() {
    let inputDate = new Date(datePicker.value);
    const currentDate = Date.now();
    const deltaTime = inputDate.getTime() - currentDate;
    const deltaTimeObj = convertMs(deltaTime);

    // explore if value is NaN abort function
    if (isNaN(inputDate)) {
      Report.info('От халепа!', 'Please choose a date in the future');
      clearInterval(intervalId);
      return;
    }

    // if user has chosen past date - cancel procces
    if (deltaTime < 0) {
      clearInterval(intervalId);
      resetBtn.classList.add('is-hidden');
      btnStart.classList.remove('is-hidden');
      datePicker.value = '';
      return;
    }

    reversTimerComponents.getDays.textContent = addLeadingZero(
      deltaTimeObj.days
    );
    reversTimerComponents.getHours.textContent = addLeadingZero(
      deltaTimeObj.hours
    );
    reversTimerComponents.getMinutes.textContent = addLeadingZero(
      deltaTimeObj.minutes
    );
    reversTimerComponents.getSeconds.textContent = addLeadingZero(
      deltaTimeObj.seconds
    );

    btnStart.classList.add('is-hidden');
    resetBtn.classList.remove('is-hidden');
  }
}
// update Reset button

function onClickClearCalendar() {
  clearInterval(intervalId);

  reversTimerComponents.getDays.textContent = '00';
  reversTimerComponents.getHours.textContent = '00';
  reversTimerComponents.getMinutes.textContent = '00';
  reversTimerComponents.getSeconds.textContent = '00';
  datePicker.value = '';

  resetBtn.classList.add('is-hidden');
  btnStart.classList.remove('is-hidden');
}
resetBtn.addEventListener('click', onClickClearCalendar);
