import { SET_FILES } from '../actions/types';

export const setFiles = payload => dispatch =>
  dispatch({
    type: SET_FILES,
    payload,
  });
