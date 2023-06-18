import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {UserAction, UpdateType} from '../const.js';
import { isPatchUpdate } from '../utils.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #pointsComponent = null;
  #editPointsComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor({pointListContainer, onDataChange, onModeChange}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointsComponent;
    const prevPointEditComponent = this.#editPointsComponent;

    this.#pointsComponent = new PointView({
      point: this.#point,
      onEventClick: this.#eventClick,
      onFavoriteClick: this.#favoriteClick,
    });
    this.#editPointsComponent = new EditPointView({
      point: this.#point,
      onFormSubmit: this.#formSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onEventClickForm: this.#eventClickForm
    });

    if(prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointsComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointsComponent, prevPointComponent);
    }

    if(this.#mode === Mode.EDITING) {
      replace(this.#editPointsComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointsComponent);
    remove(this.#editPointsComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPointsComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#editPointsComponent, this.#pointsComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard(){
    replace(this.#pointsComponent, this.#editPointsComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #eventClick = () => {
    this.#replaceCardToForm();
  };

  #favoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #formSubmit = (update) => {
    const updateType = isPatchUpdate(this.#point, update) ? UpdateType.PATCH : UpdateType.MINOR;
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      updateType,
      update,
    );
    this.#replaceFormToCard();
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #eventClickForm = () => {
    this.#replaceFormToCard();
  };
}
