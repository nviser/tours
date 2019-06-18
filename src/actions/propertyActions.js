import { SET_PROPERTY_DATA } from '../actions/types';

export const setPropertyData = payload => dispatch =>
  dispatch({
    type: SET_PROPERTY_DATA,
    payload,
  });
