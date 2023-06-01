import FilterView from './view/filter-view.js';
import {generateFilters} from './mock/filter.js';
import {render} from './framework/render.js';

export default class FilterPresenter {
  #container = null;
  #pointsModel = null;

  #filtres = [];

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;

    this.#filtres = generateFilters(this.#pointsModel.get());
  }

  init() {
    render(new FilterView(this.#filtres), this.#container);
  }
}
