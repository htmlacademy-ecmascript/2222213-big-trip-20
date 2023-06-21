import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';
export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #offers = [];
  #destinations = [];
  count = null;

  constructor(newCount, pointsApiService) {
    super();
    this.count = newCount;
    this.#pointsApiService = pointsApiService;
  }

  getPoints() {
    return this.#points;
  }

  getOffers() {
    return this.#offers;
  }

  getDestinations() {
    return this.#destinations;
  }

  async fetchDestinations() {
    try {
      const destinations = await this.#pointsApiService.getDestinations();
      this.#destinations = destinations;
    } catch (error) {
      throw new Error(error);
    }
  }

  async fetchOffers() {
    try {
      const offers = await this.#pointsApiService.getOffers();
      this.#offers = offers;
    } catch (error) {
      throw new Error(error);
    }
  }

  async init() {
    try {
      const points = await this.#pointsApiService.getPoints();
      this.#points = points.map(this.#adaptToClient);
      await this.fetchDestinations();
      await this.fetchOffers();
    } catch(err) {
      this.#points = [];
    }
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
