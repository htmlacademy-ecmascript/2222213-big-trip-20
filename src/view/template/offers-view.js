import {OFFERS} from '../../const.js';

export function createEditOffersTemplate(type, offers) {
  const currentOffers = OFFERS.find((item) => item.newType.toLocaleLowerCase() === type.toLocaleLowerCase());
  return (
    currentOffers.offers.map((offer) => /*html*/`<input
    class="event__offer-checkbox  visually-hidden"
    id="event-offer-${offer.id}"
    type="checkbox"
    name="event-offer-luggage"
    ${offers.find((item) => item.id === offer.id) ? 'checked' : ''}
    >
  <label class="event__offer-label" for="event-offer-${offer.id}">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </label>`).join('')
  );
}
