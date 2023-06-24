import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeDateForEdit} from '../utils.js';
import {createEditDestinationTemplate} from './template/destination-view.js';
import {pointsModel} from '../main.js';
import {createDestinationTemplate} from './template/destination-view.js';
import {createEditOffersTemplate} from './template/offers-view.js';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';


function createEventTypesTemplate() {
  const defaultOffers = pointsModel.getOffers();
  return (
    defaultOffers.map((item) => /*html*/ `<div class="event__type-item">
    <input id="event-type-${item.type.toLocaleLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value=${item.type.toLocaleLowerCase()}>
    <label class="event__type-label  event__type-label--${item.type.toLocaleLowerCase()}" for="event-type-${item.type.toLocaleLowerCase()}-1">${item.type}</label>
    </div>`).join(''));
}

function createEditPointTemplate(point) {
  const editEventTypesTemplate = createEventTypesTemplate();
  const defaultOffers = pointsModel.getOffers();
  const currentNewOffers = defaultOffers.find((item) => (item.type).toLocaleLowerCase() === 'flight');
  if(point.id) {
    const {destination, type, dateFrom, dateTo, offers} = point;
    const offersTemplate = createEditOffersTemplate(type, offers);
    const destinationTemplate = createEditDestinationTemplate(destination);
    const editDestinationTemplate = createDestinationTemplate(destination);
    const dateFromFull = humanizeDateForEdit(dateFrom);
    const dateToFull = humanizeDateForEdit(dateTo);
    return /*html*/ `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
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
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${he.encode(point.basePrice.toString())}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">

          ${offersTemplate}

          ${destinationTemplate}
        </section>
      </form>
    <li>`;
  } else {
    const newPoint = pointsModel.getDefaultPoint();

    const type = newPoint.type.toLocaleLowerCase();
    const offers = currentNewOffers.offers;
    const offersTemplate = createEditOffersTemplate(type, offers);

    const defaultDestinations = pointsModel.getDestinations();
    const currentNewDestination = defaultDestinations.find((item) => item.id === newPoint.destination) || defaultDestinations[0];
    const destinationTemplate = createEditDestinationTemplate(currentNewDestination.id);

    pointsModel.updateDefaultPoint({
      ...newPoint,
      offers: offers,
      destination: currentNewDestination.id,
    });
    const destinations = currentNewDestination ? currentNewDestination : defaultDestinations;
    return /*html*/ `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
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
            ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"  value=${destinations.name} list="destination-list-1">
            <datalist id="destination-list-1">
            ${defaultDestinations.map((item) => /*html*/ `
            <option value=${item.name}>${item.name}</option>`).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">

          ${offersTemplate}

          ${destinationTemplate}

        </section>
      </form>
    </li>`;
  }
}

export default class EditPointView extends AbstractStatefulView {
  #formSubmit = null;
  #eventClickForm = null;
  #datepickerFrom = null;
  #handleDeleteClick = null;
  #datepickerTo = null;
  #point = null;

  constructor({point, onFormSubmit, onEventClickForm, onDeleteClick}) {
    super();
    this._setState(EditPointView.parsePointToState(point));
    this.#formSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#eventClickForm = onEventClickForm;
    this.#point = point;
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
    const inputDestination = this.element.querySelector('.event__input--destination');
    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    const typeGroup = this.element.querySelector('.event__type-group');
    if(inputDestination) {
      inputDestination.addEventListener('change', this.#destinationInputHandler);
    }

    if(rollupBtn) {
      rollupBtn.addEventListener('click', this.#eventClickFormHandler);
    }

    if(typeGroup) {
      if(!this.#point) {
        typeGroup.addEventListener('change', this.#newOffersInputHandler);
      }
      typeGroup.addEventListener('change', this.#offersInputHandler);
    }

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    this.#setDatepicker();
  }

  #offersInputHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      offers: [],
      type: evt.target.value,
    });
  };

  #newOffersInputHandler = (evt) => {
    const newPoint = pointsModel.getDefaultPoint();
    const offers = pointsModel.getOffers();
    const currentOffers = offers.find((item) => (item.type).toLocaleLowerCase() === evt.target.value);
    evt.preventDefault();
    pointsModel.updateDefaultPoint({
      ...newPoint,
      offers: currentOffers.offers,
      type: evt.target.value,
    });
  };

  #destinationInputHandler = (evt) => {
    const allDestinations = pointsModel.getDestinations();
    const currentDestination = allDestinations.find((item) => item.name === evt.target.value);
    if(currentDestination && this.#point) {
      this.updateElement({
        destination: currentDestination.id,
      });
    } else if(currentDestination && !this.#point) {
      const newPoint = pointsModel.getDefaultPoint();
      evt.preventDefault();
      pointsModel.updateDefaultPoint({
        ...newPoint,
        destination: currentDestination.id,
      });
      this.updateElement({
        destination: currentDestination.id,
      });
    }
  };

  #setDatepicker = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
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
        onChange: this.#dateToChangeHandler,
        enableTime: true,
        minDate: this._state.dateFrom,
        locale: {
          firstDayOfWeek: 1,
        },
        'time_24hr': true
      },
    );
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateFrom: userDate,
    });

    this.#datepickerTo.set('minDate', this._state.dateFrom);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      ...this._state,
      dateTo: userDate,
    });

    this.#datepickerFrom.set('maxDate', this._state.dateTo);
  };

  #formSubmitHandler = (evt) => {
    const price = this.element.querySelector('.event__input--price').value;
    const offers = Array.from(document.querySelectorAll('.event__offer-checkbox'));
    const checkedOffers = offers.filter((offer) => offer.checked === true);
    const offersId = checkedOffers.map((item) => item.id);
    evt.preventDefault();
    this.#formSubmit(EditPointView.parseToPointState(this._state, price, offersId));
  };

  #eventClickFormHandler = (evt) => {
    evt.preventDefault();
    this.#eventClickForm(EditPointView.parsePointToState(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    pointsModel.updateDefaultPoint({
      type: 'Flight',
    });
    this.#handleDeleteClick(EditPointView.parsePointToState(this._state));
  };

  reset = () => {
  };

  static parsePointToState(state) {
    const point = {...state};
    return point;
  }

  static parseToPointState(state, price, offersId) {
    const point = {...state,
      basePrice: Number(price),
      offers: offersId,
    };
    return point;
  }
}
