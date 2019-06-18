import {
  ADD_SIGN_UP_MESSAGE_STARTED,
  ADD_SIGN_UP_MESSAGE_FINISHED,
  CLEAR_SIGN_UP_MESSAGE_STATUS,
} from './types';

export const addSignUpMessageStarted = payload => dispatch =>
  dispatch({
    type: ADD_SIGN_UP_MESSAGE_STARTED,
    payload,
  });
export const addSignUpMessageFinished = payload => dispatch =>
  dispatch({
    type: ADD_SIGN_UP_MESSAGE_FINISHED,
    payload,
  });

export const clearSignUpMessageStatus = () => dispatch => {
  dispatch({
    type: CLEAR_SIGN_UP_MESSAGE_STATUS,
  });
};

export const addSignUpMessage = form => dispatch => {
  dispatch(addSignUpMessageStarted);

  // request to the server
};

export default {
  addSignUpMessage,
};
