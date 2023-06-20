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
    // console.log('!!!');
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  async getDestinations() {
    // console.log('getDestination');
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  async getOffers() {
    // console.log('getossssss');
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
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
    const adaptedPoint = {...point,
      'base_price': Number(point.basePrice),
      'date_from': dayjs(point.dateFrom).toJSON(),
      'date_to': dayjs(point.dateTo).toJSON(),
      'is_favorite': point.isFavorite ?? false
    };

    delete adaptedPoint.price;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}

