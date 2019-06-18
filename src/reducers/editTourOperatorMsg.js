import {
  EDIT_TOUR_OPERATOR_FORM_MESSAGE_STARTED,
  EDIT_TOUR_OPERATOR_FORM_MESSAGE_FINISHED,
  CLEAR_TOUR_OPERATOR_FORM_MESSAGE_STATUS,
} from '../actions/types';

const initialState = {
  creating: false,
  created: false,
  hasErrors: false,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case EDIT_TOUR_OPERATOR_FORM_MESSAGE_STARTED:
      return {
        ...state,
        creating: true,
      };
    case EDIT_TOUR_OPERATOR_FORM_MESSAGE_FINISHED:
      return {
        ...state,
        creating: false,
        created: true,
      };
    case CLEAR_TOUR_OPERATOR_FORM_MESSAGE_STATUS:
      return { ...state, created: false };
    default:
      return state;
  }
};
