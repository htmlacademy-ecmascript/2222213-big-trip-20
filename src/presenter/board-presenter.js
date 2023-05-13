import {render, replace} from '../framework/render.js';
import ListView from '../view/list-view.js';
// import EditView from '../view/edit-view.js';
import PointView from '../view/point-view.js';
import SortView from '../view/sort-view.js';
import EditPointView from '../view/edit-point-view.js';

export default class BoardPresenter {
  #container = null;
  #pointsModel = null;

  #sortComponent = new SortView();
  #listComponent = new ListView();

  #boardPoints = [];

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    render(this.#sortComponent, this.#container);
    render(this.#listComponent, this.#container);

    // render(new EditView({point: this.#boardPoints[0]}), this.#listComponent.element);

    for (let i = 0; i < this.#boardPoints.length; i++) {
      // render(new PointView({point: this.#boardPoints[i]}), this.#listComponent.element);
      this.#renderPoint(this.#boardPoints[i]);
    }
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointsComponent = new PointView({point,
      onEventClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editPointsComponent = new EditPointView({point,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      },

      onEventClickForm: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      replace(editPointsComponent, pointsComponent);
    }

    function replaceFormToCard() {
      replace(pointsComponent, editPointsComponent);
    }

    render(pointsComponent, this.#listComponent.element);
  }
}
