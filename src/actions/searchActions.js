import { SET_SEARCH_RESULTS } from '../actions/types';

export const setSearchResults = payload => dispatch =>
  dispatch({
    type: SET_SEARCH_RESULTS,
    payload,
  });
