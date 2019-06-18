import {
  EDIT_MERCHANT_FORM_ERRORS,
  EDIT_MERCHANT_FORM_FIELD,
  CLEAR_MERCHANT_EDIT_FORM,
  SET_EDITABLE_MERCHANT_DATA,
} from './types';

export const editMerchantFormErrors = errors => dispatch =>
  dispatch({
    type: EDIT_MERCHANT_FORM_ERRORS,
    payload: errors,
  });

export const editMerchantFormField = (name, value) => dispatch =>
  dispatch({
    type: EDIT_MERCHANT_FORM_FIELD,
    payload: { name, value },
  });

export const clearMerchantEditForm = () => dispatch => {
  dispatch({
    type: CLEAR_MERCHANT_EDIT_FORM,
  });
};

export const setEditableMerchantData = payload => dispatch => {
  dispatch({
    type: SET_EDITABLE_MERCHANT_DATA,
    payload,
  });
};

export default {
  editMerchantFormErrors,
  editMerchantFormField,
  setEditableMerchantData,
};
