import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeDateForEdit} from '../utils.js';
import createEditDestinationTemplate from './template/destination-view.js';
import {pointsModel} from '../main.js';
import {createDestinationTemplate} from './template/destination-view.js';
import {createEditOffersTemplate} from './template/offers-view.js';
import {DESTINATIONS, OFFERS} from '../const.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const createEventTypesTemplate = () => OFFERS.map((item) => /*html*/ `<div class="event__type-item">
  <input id="event-type-${item.newType.toLocaleLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${item.newType.toLocaleLowerCase()}>
  <label class="event__type-label  event__type-label--${item.newType.toLocaleLowerCase()}" for="event-type-${item.newType.toLocaleLowerCase()}-1">${item.newType}</label>
</div>`).join('');

function createEditPointTemplate(point) {

  const {destination, type, dateFrom, dateTo, offers} = point;
  const offersTemplate = createEditOffersTemplate(type, offers);
  const destinationTemplate = createEditDestinationTemplate(destination);
  const editDestinationTemplate = createDestinationTemplate(destination);
  const editEventTypesTemplate = createEventTypesTemplate();
  const dateFromFull = humanizeDateForEdit(dateFrom);
  const dateToFull = humanizeDateForEdit(dateTo);
  return /*html*/ `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${editEventTypesTemplate}

            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${point.type}
        </label>
        ${editDestinationTemplate}
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value=${dateFromFull}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${dateToFull}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${point.basePrice}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
              ${offersTemplate}
            <div class="event__offer-selector"></div>
          </div>
        </section>
        ${destinationTemplate}
      </section>
    </form>
  <li>`;
}

export default class EditPointView extends AbstractStatefulView {
  #formSubmit = null;
  #eventClickForm = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point, onFormSubmit, onEventClickForm}) {
    super();
    this._setState(EditPointView.parsePointToState(point));
    this.#formSubmit = onFormSubmit;
    this.#eventClickForm = onEventClickForm;
    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#eventClickFormHandler);
    this.element.querySelector('.event__save-btn').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#offersInputHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputHandler);
    this.#setDatepicker();
  }

  #offersInputHandler = (evt) => {
    const offers = pointsModel.getOffers();
    const currentOffers = offers.find((item) => (item.newType).toLocaleLowerCase() === evt.target.value);
    evt.preventDefault();
    this.updateElement({
      offers: currentOffers.offers,
      type: evt.target.value,
    });
  };

  #destinationInputHandler = (evt) => {
    const currentDestination = DESTINATIONS.find((item) => item.name === evt.target.value);
    this.updateElement({
      destination: currentDestination,
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate,
      }
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate,
      }
    });
  };


  #setDatepicker = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromChangeHandler,
        enableTime: true,
        maxDate: this._state.dateTo,
        locale: {
          firstDayOfWeek: 1,
        },
        'time_24hr': true
      },
    );

    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onClose: this.#dateToChangeHandler,
        enableTime: true,
        minDate: this._state.dateFrom,
        locale: {
          firstDayOfWeek: 1,
        },
        'time_24hr': true
      },
    );
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#formSubmit(EditPointView.parsePointToState(this._state));
  };

  #eventClickFormHandler = (evt) => {
    evt.preventDefault();
    this.#eventClickForm(EditPointView.parsePointToState(this._state));
  };

  static parsePointToState(state) {
    const point = {...state};
    return point;
  }
}
