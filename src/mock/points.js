import {getRandomArrayElement, getRandomIntInclusive} from '../utils.js';
import {Prise, TYPE, CITY, DESCRIPTIONS, TITLE} from '../const.js';
const city = getRandomArrayElement(CITY);

export const getMockPoint = () => {
  const point = {
    id: crypto.randomUUID(),
    basePrice: getRandomIntInclusive(Prise.MIN, Prise.MAX),
    dateFrom: new Date(),
    dateTo: new Date(),
    destination: {
      id: crypto.randomUUID(),
      name: city,
      description: getRandomArrayElement(DESCRIPTIONS),
      pictures: [
        {
          srс: `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`,
          description: `${city} description`
        }
      ]
    },
    isFavorite: !!getRandomArrayElement(0, 1),
    type: getRandomArrayElement(TYPE),
    offers: {
      id: crypto.randomUUID(),
      title: getRandomArrayElement(TITLE),
      price: getRandomIntInclusive(Prise.MIN, Prise.MAX / 10),
    }
  };
  return point;
};

