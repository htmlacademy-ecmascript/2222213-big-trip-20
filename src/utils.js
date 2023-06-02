import dayjs from 'dayjs';
import {FilterType} from './const.js';

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

function isPointFuture(point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPointPresent(point) {
  return dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo);
}

function isPointPast (point) {
  return dayjs().isAfter(point.dateTo);
}

const filters = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point))
};

function capitalize (string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

export {
  getRandomArrayElement,
  formatToDate,
  formatToDateTime,
  humanizeTaskDueDate,
  formatToTime,
  getRandomIntInclusive,
  updateItem,
  isPointFuture,
  isPointPresent,
  isPointPast,
  filters,
  capitalize
};
