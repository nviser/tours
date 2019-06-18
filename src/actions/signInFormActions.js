import {
  SET_SIGN_IN_FORM_ERRORS,
  SET_SIGN_IN_FORM_FIELD,
  CLEAR_SIGN_IN_FORM,
} from './types';

export const setSignInFormErrors = errors => dispatch =>
  dispatch({
    type: SET_SIGN_IN_FORM_ERRORS,
    payload: errors,
  });

export const setSignInFormField = (name, value) => dispatch =>
  dispatch({
    type: SET_SIGN_IN_FORM_FIELD,
    payload: { name, value },
  });

export const clearSignInForm = () => dispatch => {
  dispatch({
    type: CLEAR_SIGN_IN_FORM,
  });
};

export default {
  setSignInFormErrors,
  setSignInFormField,
};
