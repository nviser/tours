import { SET_USER_DATA } from '../actions/types';

export default (state = {}, action = {}) => {
  switch (action.type) {
    case SET_USER_DATA:
      return action.payload;
    default:
      return state;
  }
};
