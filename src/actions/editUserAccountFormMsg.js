import {
  EDIT_ACCOUNT_MESSAGE_STARTED,
  EDIT_ACCOUNT_MESSAGE_FINISHED,
  CLEAR_ACCOUNT_MESSAGE_STATUS,
} from './types';

export const editAccountMessageStarted = payload => dispatch =>
  dispatch({
    type: EDIT_ACCOUNT_MESSAGE_STARTED,
    payload,
  });
export const editAccountMessageFinished = payload => dispatch =>
  dispatch({
    type: EDIT_ACCOUNT_MESSAGE_FINISHED,
    payload,
  });

export const clearAccountMessageStatus = () => dispatch => {
  dispatch({
    type: CLEAR_ACCOUNT_MESSAGE_STATUS,
  });
};

export const addAccountMessage = form => dispatch => {
  dispatch(editAccountMessageStarted);

  // request to the server
};

export default {
  addAccountMessage,
};
