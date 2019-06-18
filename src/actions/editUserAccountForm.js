import {
  EDIT_ACCOUNT_FORM_ERRORS,
  EDIT_ACCOUNT_FORM_FIELD,
  CLEAR_ACCOUNT_FORM,
  SET_ACCOUNT_DATA,
} from './types';

export const editAccountFormErrors = errors => dispatch =>
  dispatch({
    type: EDIT_ACCOUNT_FORM_ERRORS,
    payload: errors,
  });

export const editAccountFormField = (name, value) => dispatch =>
  dispatch({
    type: EDIT_ACCOUNT_FORM_FIELD,
    payload: { name, value },
  });

export const clearAccountForm = () => dispatch => {
  dispatch({
    type: CLEAR_ACCOUNT_FORM,
  });
};

export const setAccountData = payload => dispatch => {
  dispatch({
    type: SET_ACCOUNT_DATA,
    payload,
  });
};
export default {
  editAccountFormErrors,
  editAccountFormField,
};
