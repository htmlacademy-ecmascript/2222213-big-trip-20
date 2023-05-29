import {render} from '../framework/render.js';
import ListView from '../view/list-view.js';
// import EditView from '../view/edit-view.js';
// import PointView from '../view/point-view.js';
import SortView from '../view/sort-view.js';
// import EditPointView from '../view/edit-point-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils.js';

export default class BoardPresenter {
  #container = null;
  #pointsModel = null;

  #sortComponent = new SortView();
  #listComponent = new ListView();

  #boardPoints = [];
  #pointPresenters = new Map();

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.generatePoints()];
    render(this.#sortComponent, this.#container);
    render(this.#listComponent, this.#container);

    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderPoint(this.#boardPoints[i]);
    }
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#listComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
}
