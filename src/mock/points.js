import {getRandomArrayElement, getRandomIntInclusive} from '../utils.js';
import {DESTINATIONS, Prise, EVENT_TYPES, OFFERS} from '../const.js';

const getRandomOffers = (fullArray) => {
  const fullArrayLength = fullArray.offers.length;
  const randomCount = getRandomIntInclusive(0, fullArrayLength);
  let fullOffersArray = [...fullArray.offers];
  const randomOffers = [];
  for (let index = 0; index < randomCount; index++) {
    const randomIndex = getRandomIntInclusive(0, fullOffersArray.length - 1);
    const newOffer = fullOffersArray[randomIndex];
    fullOffersArray = fullOffersArray.filter((item) => item.id !== newOffer.id);
    randomOffers.push(newOffer);
  }
  return randomOffers;
};

export const getMockPoint = () => {
  const currentType = getRandomArrayElement(EVENT_TYPES);
  const currentOffers = OFFERS.find((item) => item.newType === currentType);
  const currentdestination = getRandomArrayElement(DESTINATIONS);
  const point = {
    id: crypto.randomUUID(),
    basePrice: getRandomIntInclusive(Prise.MIN, Prise.MAX),
    dateFrom: new Date(),
    dateTo: new Date(),
    destination: currentdestination,
    isFavorite: !!getRandomArrayElement(0, 1),
    type: currentType,
    offers: getRandomOffers(currentOffers),
  };
  return point;
};

