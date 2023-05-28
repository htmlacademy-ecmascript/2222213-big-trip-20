import dayjs from 'dayjs';

const DATETIME = 'DD/MM/YY-HH:mm';
const DATE = 'MMM DD';
const TIME = 'HH:mm';

function getRandomArrayElement(items) {
  const element = items[Math.floor(Math.random() * items.length)];
  return element;
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

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function isPointRepeating(repeating) {
  return Object.values(repeating).some(Boolean);
}

export {getRandomArrayElement, formatToDate, formatToDateTime, humanizeTaskDueDate, formatToTime, getRandomIntInclusive, updateItem, isPointRepeating};
