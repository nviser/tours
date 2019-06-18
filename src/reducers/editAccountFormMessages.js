import {
  EDIT_ACCOUNT_MESSAGE_STARTED,
  EDIT_ACCOUNT_MESSAGE_FINISHED,
  CLEAR_ACCOUNT_MESSAGE_STATUS,
} from '../actions/types';

const initialState = {
  creating: false,
  created: false,
  hasErrors: false,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case EDIT_ACCOUNT_MESSAGE_STARTED:
      return {
        ...state,
        creating: true,
      };
    case EDIT_ACCOUNT_MESSAGE_FINISHED:
      return {
        ...state,
        creating: false,
        created: true,
        hasErrors: action.payload.hasErrors,
      };
    case CLEAR_ACCOUNT_MESSAGE_STATUS:
      return { ...state, created: false };
    default:
      return state;
  }
};
