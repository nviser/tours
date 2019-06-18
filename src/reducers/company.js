import { SET_COMPANY_DATA } from '../actions/types';

export default (state = {}, action = {}) => {
  switch (action.type) {
    case SET_COMPANY_DATA:
      return action.payload;
    default:
      return state;
  }
};
