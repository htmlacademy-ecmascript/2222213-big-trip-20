import FilterView from '../view/filter-view.js';
// import {generateFilters} from './mock/filter.js';
import {render, replace, remove} from '../framework/render.js';
import { filter } from '../utils.js';
import { FilterType, UpdateType } from '../const.js';


export default class FilterPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;
  #filter = null;
  #filterComponent = null;
  #points = [];

  // #filtres = [];

  constructor({container, pointsModel, filterModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#filter = filter;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#points = this.#pointsModel.generatePoints();
    // this.#filtres = generateFilters(this.#pointsModel.get());
  }

  get filters() {
    // const points = this.#pointsModel.generatePoints();

    return Object.values(FilterType).map((type) => ({
      type,
      count: this.#filter[type](this.#points).length
    }));
  }

  init() {
    // render(new FilterView(this.#filtres), this.#container);
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filter: this.filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

