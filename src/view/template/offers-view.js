import { pointsModel } from '../../main.js';

export function createEditOffersTemplate(type, offers) {
  const allOffers = pointsModel.getOffers();
  const offersType = allOffers.find((item) => item.type === type);
  if(offersType) {
    return (
      offersType.offers.map((offer) => /*html*/`<input
      class="event__offer-checkbox  visually-hidden"
      id="${offer.id}"
      type="checkbox"
      name="event-offer-luggage"
      ${offers.find((item) => item === offer.id) ? 'checked' : ''}
      >
    <label class="event__offer-label" for="${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>`).join('')
    );
  } else {
    // console.log('оферсы не пришли');
  }
}
