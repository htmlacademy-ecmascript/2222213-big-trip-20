import AbstractView from '../framework/view/abstract-view.js';
import {capitalize} from '../utils.js';

function createFilterItemTemplate(filter, isChecked) {
  const {type, count} = filter;
  return /*html*/ `
    <div class="trip-filters__filter">
      <input id="filter-${type}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}"
      ${isChecked ? 'checked' : ''}
      ${count === 0 ? 'disabled' : ''}
      >
      <label
      class="trip-filters__filter-label"
      for="filter-${type}">
      ${capitalize(type)}
      </label>
    </div>`;
}

function createFilterTemplate(filters) {
  const filterItemsTemplate = filters.map((filter, index) => createFilterItemTemplate(filter, index === 0)).join('');
  return /*html*/ `
<form class="trip-filters" action="#" method="get">
  ${filterItemsTemplate}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
}

export default class FilterView extends AbstractView {
  #filters = null;
  #filterCkick = null;

  constructor({filters, onFilterCkick}) {
    super();
    this.#filters = filters;
    this.#filterCkick = onFilterCkick;

    this.element.querySelector('.trip-filters__filter').addEventListener('change', this.#filterClickHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

  #filterClickHandler = (evt) => {
    evt.preventDefault();
    this.#filterCkick(this.#filters);
  };
}
