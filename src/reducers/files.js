import { SET_FILES } from '../actions/types';

export default (state = [], action = {}) => {
  switch (action.type) {
    case SET_FILES:
      return action.payload;
    default:
      return state;
  }
};
