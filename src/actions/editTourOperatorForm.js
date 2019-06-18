import {
  EDIT_TOUR_OPERATOR_FORM_ERRORS,
  EDIT_TOUR_OPERATOR_FORM_FIELD,
  SET_EDITABLE_USER_DATA,
} from './types';

export const editTourOperatorFormErrors = errors => dispatch =>
  dispatch({
    type: EDIT_TOUR_OPERATOR_FORM_ERRORS,
    payload: errors,
  });

export const editTourOperatorFormField = (name, value) => dispatch =>
  dispatch({
    type: EDIT_TOUR_OPERATOR_FORM_FIELD,
    payload: { name, value },
  });

export const setEditableUserData = payload => dispatch => {
  dispatch({
    type: SET_EDITABLE_USER_DATA,
    payload,
  });
};

export default {
  editTourOperatorFormErrors,
  editTourOperatorFormField,
  setEditableUserData,
};
