import dayjs from 'dayjs';

const DATETIME = 'DD/MM/YY-HH:mm';
const DATE = 'MMM DD';
const TIME = 'HH:mm';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

function formatToDateTime(date) {
  return dayjs(date).format(DATETIME);
}

function formatToDate(date) {
  return dayjs(date).format(DATE);
}

function formatToTime(date) {
  return dayjs(date).format(TIME);
}

function humanizeTaskDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE) : '';
}

export {getRandomArrayElement, formatToDate, formatToDateTime, humanizeTaskDueDate, formatToTime, getRandomIntInclusive};
