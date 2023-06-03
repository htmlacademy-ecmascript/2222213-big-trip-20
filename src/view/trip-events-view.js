import AbstractView from '../framework/view/abstract-view.js';

function createTripContainerTemplate() {
  return '<section class="trip-events container"></section>';
}

export default class ContainerView extends AbstractView {
  get template() {
    return createTripContainerTemplate();
  }
}
