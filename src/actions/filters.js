import { SET_FILTERS } from './types';

export const setFilters = payload => dispatch =>
  dispatch({
    type: SET_FILTERS,
    payload,
  });
