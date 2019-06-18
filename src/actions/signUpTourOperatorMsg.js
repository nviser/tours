import {
  ADD_TOUR_OPERATOR_FORM_MESSAGE_STARTED,
  ADD_TOUR_OPERATOR_FORM_MESSAGE_FINISHED,
  CLEAR_TOUR_OPERATOR_FORM_MESSAGE_STATUS,
} from './types';

export const addTourOperatorRegisterMessageStarted = payload => dispatch =>
  dispatch({
    type: ADD_TOUR_OPERATOR_FORM_MESSAGE_STARTED,
    payload,
  });
export const addTourOperatorRegisterMessageFinished = () => dispatch =>
  dispatch({
    type: ADD_TOUR_OPERATOR_FORM_MESSAGE_FINISHED,
  });

export const clearTourOperatorRegisterMessageStatus = () => dispatch => {
  dispatch({
    type: CLEAR_TOUR_OPERATOR_FORM_MESSAGE_STATUS,
  });
};

export const addTourOperatorRegisterMessage = form => dispatch => {
  dispatch(addTourOperatorRegisterMessageStarted);

  // request to the server
};

export default {
  addTourOperatorRegisterMessage,
};
