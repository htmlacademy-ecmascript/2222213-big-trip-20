// import {getMockPoint} from '../mock/points.js';
// import getOffersObjs from './offers-model.js';
import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

// const TASK_COUNT = 5;

// const getCurrentPoints = (count = TASK_COUNT) => {
//   const points = [];
//   for (let index = 0; index < count; index++) {
//     const element = getMockPoint();
//     points.push(element);
//   }
//   return points;
// };

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  // #offers = getOffersObjs();
  #offers = [];
  #destinations = [];
  // userOffersIds = [];
  // destination = [];
  count = null;

  constructor(newCount, pointsApiService) {
    super();
    this.count = newCount;
    this.#pointsApiService = pointsApiService;

    // this.#pointsApiService.points.then((points) => {
    //   console.log(points.map(this.#adaptToClient));
    // });
  }

  // generatePoints(count) {
  //   this.#points = getCurrentPoints(count, this.#offers);
  //   return this.#points;
  // }

  getPoints() {
    return this.#points;
  }

  getOffers() {
    return this.#offers;
  }

  getDestinations() {
    // console.log('???', this.#destinations);
    return this.#destinations;
  }

  async fetchDestinations() {
    try {
      const destinations = await this.#pointsApiService.getDestinations();
      this.#destinations = destinations;
      // console.log('this.#destinations', this.#destinations);
    } catch (error) {
      // console.log(error);
    }
  }

  async fetchOffers() {
    try {
      const offers = await this.#pointsApiService.getOffers();
      this.#offers = offers;
      // console.log('this.#offers', this.#offers);
    } catch (error) {
      // console.log(error);
    }
  }

  async init() {
    try {
      const points = await this.#pointsApiService.getPoints();
      this.#points = points.map(this.#adaptToClient);
      await this.fetchDestinations();
      await this.fetchOffers();
      // console.log('this.#destinations', this.#destinations);
    } catch(err) {
      this.#points = [];
    }
    // this.#points.forEach((item) => {
    //   const destination = this.#pointsApiService.getDestination(item.destination);
    //   console.log(destination);
    // });
    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.find((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        update,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update task');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [
        newPoint,
        ...this.#points,
      ];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add task');
    }
  }

  async deletePoint(updateType, deletingPoint) {
    const index = this.#points.findIndex((point) => point.id === deletingPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(deletingPoint);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete task');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];
    return adaptedPoint;
  }
}
