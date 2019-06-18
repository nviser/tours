import {
  SET_IS_AUTHORIZED,
  SET_USER_PROFILE,
  SET_USER_AVATAR,
  SET_USER_ACTIVE,
} from '../actions/types';

const initialState = {
  isLoggedIn: false,
  userData: {},
  avatar: null,
  isUserActive: true,
  facebookConnected: null,
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_IS_AUTHORIZED:
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    case SET_USER_PROFILE:
      return {
        ...state,
        userData: action.payload,
      };
    case SET_USER_AVATAR:
      return {
        ...state,
        avatar: action.payload,
      };
    case SET_USER_ACTIVE:
      return {
        ...state,
        isUserActive: action.payload,
      };

    default:
      return state;
  }
};
