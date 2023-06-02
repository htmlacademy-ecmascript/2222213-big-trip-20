import {filters} from '../utils.js';

function generateFilters(points) {
  return Object.entries(filters).map(
    ([filterType, filterPoints]) => ({
      type: filterType,
      count: filterPoints(points).length > 0,
    }),
  );
}

export {generateFilters};
