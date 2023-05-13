import {getMockPoint} from '../mock/points.js';

const TASK_COUNT = 5;

const getCurrentPoints = (count = TASK_COUNT) => {
  const points = [];
  for (let index = 0; index < count; index++) {
    const element = getMockPoint();
    points.push(element);
  }
  return points;
};

export default class PointsModel {
  get points() {
    return getCurrentPoints();
  }
}
