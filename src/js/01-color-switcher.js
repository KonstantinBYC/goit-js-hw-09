// функція getRandomHexColor, по замовчуванню
function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}
// змінні кнопок Старт та Стоп
const links = {
  start: document.querySelector('[data-start]'),
  stop: document.querySelector('[data-stop]'),
};
// додаємо слухача на кнопку Старт
links.start.addEventListener('click', changeBackByClick);
let btnStatus = true;
let intervalId = null;
// скрипт, який після натискання кнопки «Start», раз на секунду змінює колір фону <body> та дезактивує кнопку Старт.
function changeBackByClick() {
  const changeBgColor = () =>
    (document.querySelector('body').style.backgroundColor =
      getRandomHexColor());
  intervalId = setInterval(changeBgColor, 1000);
  if (btnStatus) {
    links.start.setAttribute('disabled', 'disabled');
    btnStatus = false;
  }
}
// додаємо слухача на кнопку Стоп
links.stop.addEventListener('click', stopBgChange);
// функція, що зупиняє зміну кольорів фону та активує кнопку Старт.
function stopBgChange() {
  clearInterval(intervalId);
  if (!btnStatus) {
    links.start.removeAttribute('disabled');
    btnStatus = true;
  }
}
