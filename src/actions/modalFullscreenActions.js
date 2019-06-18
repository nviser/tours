import { SET_FULL_SCREEN } from '../actions/types';

export const setFullScreen = value => dispatch =>
  dispatch({
    type: SET_FULL_SCREEN,
    value,
  });
