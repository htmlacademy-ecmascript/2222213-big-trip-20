import {EVENT_TYPES, Prise, Title} from '../const.js';
import {getRandomArrayElement, getRandomIntInclusive} from '../utils.js';

const countOffers = {
  MIN: 1,
  MAX: 3
};

const getOffer = () => {
  const offer = {
    id: crypto.randomUUID(),
    title: getRandomArrayElement(Title),
    price: getRandomIntInclusive(Prise.MIN, Prise.MAX / 10),
  };
  return offer;
};

const getOffers = () => {
  const newCountOfeers = getRandomIntInclusive(countOffers.MIN, countOffers.MAX);
  const offers = [];
  for (let index = 0; index < newCountOfeers; index++) {
    const element = getOffer();
    offers.push(element);
  }
  return offers;
};

const getOffersObjs = () => {
  const offersObjects = EVENT_TYPES.map((item) => {
    const newType = item;
    const offers = getOffers();
    return{newType, offers};
  });
  return offersObjects;
};

export default getOffersObjs;
