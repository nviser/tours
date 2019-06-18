import {
  SET_USER_FOR_EDIT,
  EDIT_USER,
  SET_CHANGE_PASS_POPUP,
  SET_PASS,
  CLEAR_CHANGE_PASS_FORM,
  SET_PASS_FORM_ERRORS,
  SET_COMPANY_FOR_EDIT,
  EDIT_COMPANY,
  SWITCH_RANGE_PICKER,
} from './types';

export const setUserForEdit = payload => dispatch =>
  dispatch({
    type: SET_USER_FOR_EDIT,
    payload,
  });

export const editUser = (name, value) => dispatch =>
  dispatch({
    type: EDIT_USER,
    payload: { name, value },
  });

export const setChangePassPopup = payload => dispatch =>
  dispatch({
    type: SET_CHANGE_PASS_POPUP,
    payload,
  });

export const setPass = (name, value) => dispatch =>
  dispatch({
    type: SET_PASS,
    payload: { name, value },
  });

export const clearChangePassForm = () => dispatch =>
  dispatch({
    type: CLEAR_CHANGE_PASS_FORM,
  });

export const setPassFormErrors = payload => dispatch =>
  dispatch({
    type: SET_PASS_FORM_ERRORS,
    payload,
  });

export const setCompanyForEdit = payload => dispatch =>
  dispatch({
    type: SET_COMPANY_FOR_EDIT,
    payload,
  });

export const editCompany = (name, value) => dispatch =>
  dispatch({
    type: EDIT_COMPANY,
    payload: { name, value },
  });

export const switchRangePicker = payload => dispatch =>
  dispatch({
    type: SWITCH_RANGE_PICKER,
    payload,
  });
