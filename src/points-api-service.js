import ApiService from './framework/api-service.js';
import dayjs from 'dayjs';

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
    const adaptedPoint = {
      'base_price': Number(point.basePrice),
      'date_from': dayjs(point.dateFrom).toJSON(),
      'date_to': dayjs(point.dateTo).toJSON(),
      'is_favorite': point.isFavorite ?? false,
      'destination': point.destination,
      'offers': point.offers,
      'type': point.type
    };

    return adaptedPoint;
  }
}

