import { SET_SIGN_IN_DIALOG, SET_SIGN_UP_DIALOG } from '../actions/types';

const initialState = {
  isActiveSignInDialog: false,
  isActiveSignUpDialog: false,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_SIGN_IN_DIALOG:
      return {
        ...state,
        isActiveSignInDialog: action.payload,
      };
    case SET_SIGN_UP_DIALOG:
      return {
        ...state,
        isActiveSignUpDialog: action.payload,
      };
    default:
      return state;
  }
};
