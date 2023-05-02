import NewTaskHeaderView from './view/header-view.js';
import FilterView from './view/filter-view.js';
import {render, RenderPosition} from './render.js';
import BoardPresenter from './presenter/board-presenter.js';


const bodyElement = document.querySelector('.page-body');
const hederElement = bodyElement.querySelector('.page-header');
const tripElement = hederElement.querySelector('.trip-main');
const tripControlsFiltersElement = tripElement.querySelector('.trip-controls__filters');
const pageMainElement = bodyElement.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({container: tripEventsElement});

render(new FilterView(), tripControlsFiltersElement);
render(new NewTaskHeaderView(), tripElement, RenderPosition.AFTERBEGIN);

boardPresenter.init();
