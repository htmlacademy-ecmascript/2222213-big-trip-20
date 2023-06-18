import {getMockPoint} from '../mock/points.js';
import getOffersObjs from './offers-model.js';
import Observable from '../framework/observable.js';

const TASK_COUNT = 5;

const getCurrentPoints = (count = TASK_COUNT) => {
  const points = [];
  for (let index = 0; index < count; index++) {
    const element = getMockPoint();
    points.push(element);
  }
  return points;
};

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #offers = getOffersObjs();
  count = null;

  constructor(newCount, pointsApiService) {
    super();
    this.count = newCount;
    this.#pointsApiService = pointsApiService;

    // this.#pointsApiService.point.then((points) => {
    //   console.log(points);
    // });
  }

  generatePoints(count) {
    this.#points = getCurrentPoints(count, this.#offers);
    return this.#points;
  }

  getPoints() {
    return this.#points;
  }

  getOffers() {
    return this.#offers;
  }

  updatePoint(updateType, update) {
    const index = this.#points.find((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, deletingPoint) {
    const index = this.#points.findIndex((point) => point.id === deletingPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
