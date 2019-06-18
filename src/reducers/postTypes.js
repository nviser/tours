import { SET_POST_TYPES } from '../actions/types';

export default (state = [], action = {}) => {
  switch (action.type) {
    case SET_POST_TYPES:
      return action.payload;
    default:
      return state;
  }
};
