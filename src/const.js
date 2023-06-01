import {getDestinations} from './model/destinations-model.js';
import getOffersObjs from './model/offers-model.js';

const EVENT_TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant'
];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.'
];

const CITY = [
  'Amsterdam',
  'Chamonix',
  'Geneva'
];

const DESTINATIONS = getDestinations();

const Title = [
  'Add luggage',
  'Switch to comfort class',
  'Add meal',
  'Choose seats',
  'Travel by train'
];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present ',
  PAST: 'past ',
};

const Prise = {
  MIN: 1,
  MAX: 1000
};

const OFFERS = getOffersObjs();

export {EVENT_TYPES, DESCRIPTIONS, CITY, Prise, Title, DESTINATIONS, OFFERS, FilterType};
