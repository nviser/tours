import {
  SET_TOUR_OPERATOR_FORM_ERRORS,
  SET_TOUR_OPERATOR_FORM_FIELD,
  CLEAR_TOUR_OPERATOR_FORM,
  SET_EDITABLE_USER_DATA,
  SET_TOUR_OPERATOR_FORM,
} from './types';

export const setTourOperatorFormErrors = errors => dispatch =>
  dispatch({
    type: SET_TOUR_OPERATOR_FORM_ERRORS,
    payload: errors,
  });

export const setTourOperatorFormField = (name, value) => dispatch =>
  dispatch({
    type: SET_TOUR_OPERATOR_FORM_FIELD,
    payload: { name, value },
  });

export const setTourOperatorForm = form => dispatch =>
  dispatch({
    type: SET_TOUR_OPERATOR_FORM,
    payload: form,
  });

export const clearTourOperatorForm = () => dispatch => {
  dispatch({
    type: CLEAR_TOUR_OPERATOR_FORM,
  });
};

export const setEditableUserData = payload => dispatch => {
  dispatch({
    type: SET_EDITABLE_USER_DATA,
    payload,
  });
};

export default {
  setTourOperatorFormErrors,
  setTourOperatorFormField,
  setEditableUserData,
};
