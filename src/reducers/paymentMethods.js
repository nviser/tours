import { SET_PAYMENT_METHODS, SET_EDIT_CARD } from '../actions/types';

const initialState = {
  cards: [],
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_PAYMENT_METHODS:
      return {
        ...state,
        cards: action.payload,
      };
    case SET_EDIT_CARD:
      return {
        ...state,
        edited_card: action.payload,
      };
    default:
      return state;
  }
};
