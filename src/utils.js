import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
// import { FilterType } from './const.js';

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(relativeTime);

const DATE_FORMAT_FOR_EDIT = 'DD/MM/YY-HH:mm';
const DATE_FORMAT_FOR_EVENT_DATE = 'MMM DD';
const DATE_FORMAT_FOR_EVENT_TIME = 'HH:mm';
const HOURES_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = MS_IN_SECOND * SECONDS_IN_MINUTE;
const MS_IN_HOUR = MS_IN_MINUTE * MINUTES_IN_HOUR;
const MS_IN_DAY = MS_IN_HOUR * HOURES_IN_DAY;

const getTimeGap = (dateFrom, dateTo) => {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));
  let timeGap = 0;
  switch (true) {
    case (timeDiff >= MS_IN_DAY) :
      timeGap = dayjs.duration(timeDiff).format('DD[d] HH[H] mm[M]');
      break;
    case (timeDiff >= MS_IN_HOUR) :
      timeGap = dayjs.duration(timeDiff).format('HH[H] mm[M]');
      break;
    case (timeDiff < MS_IN_HOUR) :
      timeGap = dayjs.duration(timeDiff).format('mm[M]');
      break;
  }
  return timeGap;
};

const humanizeDateForEdit = (date) => date ? dayjs(date).utc().format(DATE_FORMAT_FOR_EDIT) : '';
const humanizeDateForEvent = (date) => date ? dayjs(date).utc().format(DATE_FORMAT_FOR_EVENT_DATE) : '';
const humanizeTimeFrom = (date) => date ? dayjs(date).utc().format(DATE_FORMAT_FOR_EVENT_TIME) : '';
const humanizeTimeTo = (date) => date ? dayjs(date).utc().format(DATE_FORMAT_FOR_EVENT_TIME) : '';

function getRandomArrayElement(items) {
  const element = items[Math.floor(Math.random() * items.length)];
  return element;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
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

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present ',
  PAST: 'past ',
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point))
};


function capitalize (string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

function sortByDay(eventA, eventB) {
  if (dayjs(eventA.dateFrom).isAfter(dayjs(eventB.dateFrom))) {
    return 1;
  }

  if (dayjs(eventA.dateFrom) === dayjs(eventB.dateFrom)) {
    return 0;
  }

  if (dayjs(eventA.dateFrom).isBefore(dayjs(eventB.dateFrom))) {
    return -1;
  }
}

function sortByTime(eventA, eventB) {
  return dayjs(eventB.dateTo).diff(dayjs(eventB.dateFrom)) - dayjs(eventA.dateTo).diff(dayjs(eventA.dateFrom));
}

function sortByPrice(eventA, eventB) {
  return eventB.basePrice - eventA.basePrice;
}

function isPatchUpdate(point, update) {
  return dayjs(point.dateFrom).isSame(dayjs(update.dateFrom)) &&
  dayjs(point.dateTo).isSame(dayjs(update.dateTo));
}

export {
  getRandomArrayElement,
  getRandomIntInclusive,
  updateItem,
  isPointFuture,
  isPointPresent,
  isPointPast,
  filter,
  capitalize,
  humanizeDateForEdit,
  humanizeDateForEvent,
  humanizeTimeFrom,
  humanizeTimeTo,
  getTimeGap,
  sortByDay,
  sortByTime,
  sortByPrice,
  isPatchUpdate
};
