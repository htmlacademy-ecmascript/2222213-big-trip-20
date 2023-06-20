import {CITY} from '../../const.js';
import { pointsModel } from '../../main.js';

function createEditDestinationTemplate(destination) {
  const allDestinations = pointsModel.getDestinations();
  const currentDestination = allDestinations.find((item) => item.id === destination);
  // console.log('currentDestination', currentDestination);
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
  } else {
    // console.log('дестинатион не пришел');
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
        ${CITY.map((item) => /*html*/ `
          <option value=${item}>${item}</option>`).join('')}
        </datalist>
      </div>`);
  } else {
    // console.log('дестинатион не пришел');
  }
}

export default createEditDestinationTemplate;

