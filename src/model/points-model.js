import {getMockPoint} from '../mock/points.js';
import getOffersObjs from './offers-model.js';

const TASK_COUNT = 5;

const getCurrentPoints = (count = TASK_COUNT) => {
  const points = [];
  for (let index = 0; index < count; index++) {
    const element = getMockPoint();
    points.push(element);
  }
  return points;
};

export default class PointsModel {
  points = [];
  offers = getOffersObjs();
  count = null;
  constructor(newCount) {
    this.count = newCount;
  }

  generatePoints(count) {
    this.points = getCurrentPoints(count, this.offers);
    return this.points;
  }

  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }
}
