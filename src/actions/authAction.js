import {
  SET_IS_AUTHORIZED,
  SET_USER_PROFILE,
  SET_USER_AVATAR,
  SET_USER_ACTIVE,
} from './types';

export const setIsAuthorized = payload => dispatch =>
  dispatch({
    type: SET_IS_AUTHORIZED,
    payload,
  });

export const setUserProfile = payload => dispatch =>
  dispatch({
    type: SET_USER_PROFILE,
    payload,
  });

export const setUserAvatar = payload => dispatch =>
  dispatch({
    type: SET_USER_AVATAR,
    payload,
  });

export const setUserActive = payload => dispatch =>
  dispatch({
    type: SET_USER_ACTIVE,
    payload,
  });
