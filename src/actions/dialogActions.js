import { SET_SIGN_IN_DIALOG, SET_SIGN_UP_DIALOG } from './types';

export const showSignInDialog = payload => dispatch =>
  dispatch({
    type: SET_SIGN_IN_DIALOG,
    payload,
  });

export const showSignUpDialog = payload => dispatch =>
  dispatch({
    type: SET_SIGN_UP_DIALOG,
    payload,
  });
