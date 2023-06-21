import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../utils.js';

const NoPointTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

function createNoPointTemplate({filterType}) {
  const noPointText = NoPointTextType[filterType];
  return (/*HTML*/ `<p class="trip-events__msg">${noPointText}</p>`);
}

export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;

  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}
