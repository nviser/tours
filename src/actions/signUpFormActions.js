import {
  SET_SIGN_UP_FORM_ERRORS,
  SET_SIGN_UP_FORM_FIELD,
  CLEAR_SIGN_UP_FORM,
} from './types';

export const setSignUpFormErrors = errors => dispatch =>
  dispatch({
    type: SET_SIGN_UP_FORM_ERRORS,
    payload: errors,
  });

export const setSignUpFormField = (name, value) => dispatch =>
  dispatch({
    type: SET_SIGN_UP_FORM_FIELD,
    payload: { name, value },
  });

export const clearSignUpForm = () => dispatch => {
  dispatch({
    type: CLEAR_SIGN_UP_FORM,
  });
};

export default {
  setSignUpFormErrors,
  setSignUpFormField,
};
