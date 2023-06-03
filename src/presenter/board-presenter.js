import {render, RenderPosition} from '../framework/render.js';
import ListView from '../view/list-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils.js';
import ContainerView from '../view/trip-events-view.js';
import {sortByDay, sortByTime, sortByPrice} from '../utils.js';
import { SortType } from '../const.js';
import NoEventView from '../view/no-event-view.js';

export default class BoardPresenter {
  #container = null;
  #pointsModel = null;

  #sortComponent = null;
  #listComponent = new ListView();
  #boardComponent = new ContainerView();
  #noEventComponent = new NoEventView();

  #boardPoints = [];
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sourcedBoardPoints = [];

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.generatePoints()];
    this.#sourcedBoardPoints = [...this.#pointsModel.generatePoints()];
    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoint(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#boardPoints.sort(sortByDay);
        break;
      case SortType.TIME:
        this.#boardPoints.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortByPrice);
        break;
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoint(sortType);
    this.#clearEventsList();
    this.#renderEventsList();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#listComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.#boardPoints.forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    render(this.#noEventComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearEventsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderEventsList() {
    render(this.#listComponent, this.#boardComponent.element);
    this.#renderPoints();
  }

  #renderBoard() {
    render(this.#boardComponent, this.#container);
    if (!this.#boardPoints) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderEventsList();
  }
}
