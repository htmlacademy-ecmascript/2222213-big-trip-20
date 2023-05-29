import {DESCRIPTIONS, CITY} from '../const.js';
import {getRandomArrayElement, getRandomIntInclusive} from '../utils.js';
const countPictures = {
  MIN: 1,
  MAX: 4
};

const getPictures = () => {
  const newCountPictures = getRandomIntInclusive(countPictures.MIN, countPictures.MAX);
  const picture = [];
  for (let index = 0; index < newCountPictures; index++) {
    const element = {
      src: `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
      description: 'test',
    };
    picture.push(element);
  }
  return picture;
};

export const getDestinations = () => {
  const destinations = [];
  CITY.forEach((test) => {
    const obj = {
      name: test,
      pictures: getPictures(),
      id: crypto.randomUUID(),
      description: getRandomArrayElement(DESCRIPTIONS),
    };
    destinations.push(obj);
  });
  return destinations;
};
