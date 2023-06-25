import ApiService from './framework/api-service.js';
import dayjs from 'dayjs';
import { pointsModel } from './main.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApiService extends ApiService {
  async getPoints() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse).catch((err) => {
        throw new Error(err);
      });
  }

  async getDestinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse).catch((err) => {
        throw new Error(err);
      });
  }

  async getOffers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse).catch((err) => {
        throw new Error(err);
      });
  }


  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'Application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    const allPoints = pointsModel.getPoints();
    const filteredPoints = allPoints.filter((item) => item.id !== point.id);
    pointsModel.setPoints(filteredPoints);

    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'Application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer(point) {
    const defaultPoint = pointsModel.getDefaultPoint();
    const adaptedPoint = {
      'base_price': Number(point.basePrice),
      'date_from': dayjs(point.dateFrom).toJSON(),
      'date_to': dayjs(point.dateTo).toJSON(),
      'is_favorite': point.isFavorite ?? false,
      'destination': point.destination || defaultPoint.destination,
      'offers': point.offers,
      'type': point.type || defaultPoint.type.toLocaleLowerCase(),
    };

    return adaptedPoint;
  }
}

