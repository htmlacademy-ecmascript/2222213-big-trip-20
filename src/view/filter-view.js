import AbstractView from '../framework/view/abstract-view.js';
import {capitalize} from '../utils.js';

function createFilterItemTemplate(filter, currentFilterType) {
  const {type} = filter;
  return /*html*/ `
    <div class="trip-filters__filter">
      <input id="filter-${type}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}"
      ${type === currentFilterType ? 'checked' : ''}
      >
      <label
      class="trip-filters__filter-label"
      for="filter-${type}">
      ${capitalize(type)}
      </label>
    </div>`;
}

function createFilterTemplate(filterItems, currentFilterType) {
  const filterItemsTemplate = filterItems.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');
  return /*html*/ `
<form class="trip-filters" action="#" method="get">
  ${filterItemsTemplate}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
}

export default class FilterView extends AbstractView {
  #filter = null;
  // #currentFilter = null;
  // #handleFilterTypeChange = null;

  constructor({filter, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filter = filter;
    this.currentFilterType = currentFilterType;
    this.handleFilterTypeChange = onFilterTypeChange;

    this.element.querySelectorAll('.trip-filters__filter-input').forEach((item) => {
      item.addEventListener('change', this.#filterTypeChangeHandler);
    });
  }

  get template() {
    return createFilterTemplate(this.#filter, this.currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.handleFilterTypeChange(evt.target.value);
  };
}
