import {
  ADD_SIGN_UP_MESSAGE_STARTED,
  ADD_SIGN_UP_MESSAGE_FINISHED,
  CLEAR_SIGN_UP_MESSAGE_STATUS,
} from '../actions/types';

const initialState = {
  creating: false,
  created: false,
  hasErrors: false,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case ADD_SIGN_UP_MESSAGE_STARTED:
      return {
        ...state,
        creating: true,
      };
    case ADD_SIGN_UP_MESSAGE_FINISHED:
      return {
        ...state,
        creating: false,
        created: true,
        hasErrors: action.payload.hasErrors,
      };
    case CLEAR_SIGN_UP_MESSAGE_STATUS:
      return { ...state, created: false };
    default:
      return state;
  }
};
