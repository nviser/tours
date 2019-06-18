import {
  EDIT_TOUR_OPERATOR_FORM_MESSAGE_STARTED,
  EDIT_TOUR_OPERATOR_FORM_MESSAGE_FINISHED,
  CLEAR_TOUR_OPERATOR_FORM_EDIT_MESSAGE_STATUS,
} from './types';

export const addTourOperatorEditMessageStarted = payload => dispatch =>
  dispatch({
    type: EDIT_TOUR_OPERATOR_FORM_MESSAGE_STARTED,
    payload,
  });
export const addTourOperatorEditMessageFinished = () => dispatch =>
  dispatch({
    type: EDIT_TOUR_OPERATOR_FORM_MESSAGE_FINISHED,
  });

export const clearTourOperatorEditMessageStatus = () => dispatch => {
  dispatch({
    type: CLEAR_TOUR_OPERATOR_FORM_EDIT_MESSAGE_STATUS,
  });
};

export const addTourOperatorEditMessage = form => dispatch => {
  dispatch(addTourOperatorEditMessageStarted);

  // request to the server
};

export default {
  addTourOperatorEditMessage,
  addTourOperatorEditMessageFinished,
};
