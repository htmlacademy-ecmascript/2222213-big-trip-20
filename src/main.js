import {render, RenderPosition} from './framework/render.js';
import NewTaskHeaderView from './view/header-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic hS2sfS35ec29sa2j';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';


const bodyElement = document.querySelector('.page-body');
const hederElement = bodyElement.querySelector('.page-header');
const tripElement = hederElement.querySelector('.trip-main');
const tripControlsFiltersElement = tripElement.querySelector('.trip-controls__filters');
const pageMainElement = bodyElement.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');
const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
export const pointsModel = new PointsModel(
  pointsApiService
);
const filterModel = new FilterModel();
export const boardPresenter = new BoardPresenter({
  container: tripEventsElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  container: tripControlsFiltersElement,
  filterModel,
  pointsModel
});

const newPointButtonComponent = new NewPointButtonView ({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(new NewTaskHeaderView(), tripElement, RenderPosition.AFTERBEGIN);

filterPresenter.init();
boardPresenter.init();
pointsModel.init().finally(() => {
  const offers = pointsModel.getOffers();
  const destinations = pointsModel.getDestinations();
  if(offers.length && destinations.length) {
    render(newPointButtonComponent, tripElement, RenderPosition.BEFOREEND);
  }
});
