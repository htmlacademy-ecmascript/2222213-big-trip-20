import { pointsModel } from '../../main.js';

export function createEditDestinationTemplate(destination) {
  const allDestinations = pointsModel.getDestinations();
  const currentDestination = allDestinations.find((item) => item.id === destination);
  if(currentDestination) {
    return (
      /*html*/ `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${currentDestination.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${currentDestination.pictures.map((picture) => /*html*/ `
              <img class="event__photo" src=${picture.src} alt=${picture.description}>`).join('')}
          </div>
        </div>
    </section>`);
  }
}

export function createDestinationTemplate(destination) {
  const allDestinations = pointsModel.getDestinations();
  const currentDestination = allDestinations.find((item) => item.id === destination);
  if(currentDestination) {
    return (
      /*html*/ `<input
        class="event__input  event__input--destination"
        id="event-destination-1"
        name="event-destination"
        value=${currentDestination.name}
        list="destination-list-1">
        <datalist id="destination-list-1">
        ${allDestinations.map((item) => /*html*/ `
          <option value=${item.name}>${item.name}</option>`).join('')}
        </datalist>
      </div>`);
  }
}
