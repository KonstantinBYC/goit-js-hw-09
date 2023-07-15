import { Report } from 'notiflix/build/notiflix-report-aio';

const links = {
  form: document.querySelector('.form'),
  firstDelay: document.querySelector('input[name="delay"]'),
  step: document.querySelector('input[name="step"]'),
  amount: document.querySelector('input[name="amount"]'),
};
links.form.addEventListener('submit', onClick);

/* функція повертає результат ввода і вмикає функцію createPromise
 */
function onClick(e) {
  e.preventDefault();
  const amountP = parseInt(links.amount.value);
  const delayStep = Number(links.step.value);
  let fistDelay = Number(links.firstDelay.value);

  for (let i = 1; i <= amountP; i += 1) {
    createPromise(i, fistDelay)
      .then(({ position, delay }) => {
        Report.success(`Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Report.failure(`Rejected promise ${position} in ${delay}ms`);
      });
    fistDelay += delayStep;
  }
}
// /*  function that create new promise
//  *  position - amount of promises
//  *  delay - first delay */
function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
