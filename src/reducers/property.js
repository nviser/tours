import { SET_PROPERTY_DATA } from '../actions/types';

export default (state = {}, action = {}) => {
  switch (action.type) {
    case SET_PROPERTY_DATA:
      return action.payload;
    default:
      return state;
  }
};
