import { SET_USER_DATA } from '../actions/types';

export const setUserData = payload => dispatch =>
  dispatch({
    type: SET_USER_DATA,
    payload,
  });
