import { SET_LOADER } from './types';

export const setLoader = payload => dispatch =>
  dispatch({
    type: SET_LOADER,
    payload,
  });
