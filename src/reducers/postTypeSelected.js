import { SET_SELECTED_POST_TYPE } from '../actions/types';

export default (state = '', action = {}) => {
  switch (action.type) {
    case SET_SELECTED_POST_TYPE:
      return action.payload;
    default:
      return state;
  }
};
