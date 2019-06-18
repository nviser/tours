import { SET_SEARCH_RESULTS } from '../actions/types';

export default (state = [], action = {}) => {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return action.payload;
    default:
      return state;
  }
};
