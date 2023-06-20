import {render, RenderPosition, remove} from '../framework/render.js';
import ListView from '../view/list-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
// import { updateItem } from '../utils.js';
import LoadingView from '../view/point-loading-view.js';
import ContainerView from '../view/trip-events-view.js';
import {sortByTime, sortByPrice} from '../utils.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import NoPointView from '../view/no-event-view.js';
import { filter } from '../utils.js';

export default class BoardPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;

  #sortComponent = null;
  #listComponent = new ListView();
  #boardComponent = new ContainerView();
  #loadingComponent = new LoadingView();
  #noPointComponent = null;

  // #boardPoints = [];
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  // #sourcedBoardPoints = [];

  constructor({container, pointsModel, filterModel, onNewPointDestroy}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.filterType = this.#filterModel.filter;
  }

  init() {
    // this.#boardPoints = [...this.#pointsModel.generatePoints()];
    // this.#sourcedBoardPoints = [...this.#pointsModel.generatePoints()];
    // this.#pointsModel.generatePoints();
    this.#renderBoard();
    // console.log('test', this.#pointsModel.getPoints());
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.getPoints();
    const filteredPoints = filter[this.#filterType](points);
    console.log(filteredPoints);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }

    return filteredPoints;
    // return this.#pointsModel.getPoints();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  // #handlePointChange = (updatedPoint) => {
  // this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
  // this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
  //   this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  // };

  #handleViewAction = (actionType, updateType, update) => {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        // - обновить всю доску (например, при переключении фильтра)
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  };


  // #sortPoint(sortType) {
  //   switch (sortType) {
  //     case SortType.DAY:
  //       this.#boardPoints.sort(sortByDay);
  //       break;
  //     case SortType.TIME:
  //       this.#boardPoints.sort(sortByTime);
  //       break;
  //     case SortType.PRICE:
  //       this.#boardPoints.sort(sortByPrice);
  //       break;
  //   }
  //   this.#currentSortType = sortType;
  // }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  // #handleFilterTypeChange = (newFilterType) => {
  //   if (this.#filterType === newFilterType) {
  //     return;
  //   }

  //   this.#filterType = newFilterType;
  //   this.#clearBoard();
  //   this.#renderBoard();
  // };

  // #renderFilter() {
  //   console.log('renderFilter', this.#filterModel.filter);
  //   this.#filterComponent = new FilterView({
  //     filter: this.#filterModel.filter,
  //     currentFilterType: this.#filterType,
  //     onFilterTypeChange: this.#handleFilterTypeChange
  //   });

  //   render(this.#filterComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  // }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });

    render(this.#noPointComponent, this.#listComponent.element, RenderPosition.AFTERBEGIN);
  }

  // #clearEventsList() {
  //   this.#pointPresenters.forEach((presenter) => presenter.destroy());
  //   this.#pointPresenters.clear();
  // }

  #renderPointsList() {
    // const pointCount = this.#pointsModel.generatePoints();
    const pointCount = this.#pointsModel.getPoints();
    render(this.#listComponent, this.#container);
    this.#renderPoints(pointCount);
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }


  #renderBoard() {
    render(this.#boardComponent, this.#container);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    // this.#renderFilter();
    this.#renderSort();
    this.#renderPointsList();
  }
}
