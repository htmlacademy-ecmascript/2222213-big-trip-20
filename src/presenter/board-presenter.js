import ListView from '../view/list-view.js';
import EditView from '../view/edit-view.js';
import PointView from '../view/point-view.js';
import SortView from '../view/sort-view.js';
import {render} from '../render.js';

export default class BoardPresenter {
  sortComponent = new SortView();
  listComponent = new ListView();

  constructor({container, pointsModel}) {
    this.container = container;
    this.pointsModel = pointsModel;
  }

  init() {
    this.boardPoints = [...this.pointsModel.getPoints()];
    render(this.sortComponent, this.container);
    render(this.listComponent, this.container);

    render(new EditView({point: this.boardPoints[0]}), this.listComponent.getElement());

    for (let i = 0; i < this.boardPoints.length; i++) {
      render(new PointView({point: this.boardPoints[i]}), this.listComponent.getElement());
    }
  }
}
