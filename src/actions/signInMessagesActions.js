import {
  ADD_SIGN_IN_MESSAGE_STARTED,
  ADD_SIGN_IN_MESSAGE_FINISHED,
  CLEAR_SIGN_IN_MESSAGE_STATUS,
} from './types';

export const addSignInMessageStarted = payload => dispatch =>
  dispatch({
    type: ADD_SIGN_IN_MESSAGE_STARTED,
    payload,
  });
export const addSignInMessageFinished = payload => dispatch =>
  dispatch({
    type: ADD_SIGN_IN_MESSAGE_FINISHED,
    payload,
  });

export const clearSignInMessageStatus = () => dispatch => {
  dispatch({
    type: CLEAR_SIGN_IN_MESSAGE_STATUS,
  });
};

export const addSignInMessage = form => dispatch => {
  dispatch(addSignInMessageStarted);

  // request to the server
};

export default {
  addSignInMessage,
};
