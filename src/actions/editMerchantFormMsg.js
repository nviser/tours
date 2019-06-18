import {
  EDIT_MERCHANT_FORM_MESSAGE_STARTED,
  EDIT_MERCHANT_FORM_MESSAGE_FINISHED,
  CLEAR_MERCHANT_EDIT_FORM_MESSAGE_STATUS,
} from './types';

export const editMerchantMessageStarted = payload => dispatch =>
  dispatch({
    type: EDIT_MERCHANT_FORM_MESSAGE_STARTED,
    payload,
  });
export const editMerchantMessageFinished = () => dispatch =>
  dispatch({
    type: EDIT_MERCHANT_FORM_MESSAGE_FINISHED,
  });

export const clearMerchantMessageStatus = () => dispatch => {
  dispatch({
    type: CLEAR_MERCHANT_EDIT_FORM_MESSAGE_STATUS,
  });
};

export const editMerchantMessage = form => dispatch => {
  dispatch(editMerchantMessageStarted);

  // request to the server
};

export default {
  editMerchantMessage,
};
