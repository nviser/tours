import { SET_FILTERS } from '../actions/types';

const initialState = {
  activeFilters: [],
};

export default (state = initialState, action = []) => {
  switch (action.type) {
    case SET_FILTERS:
      return {
        ...state,
        activeFilters: action.payload,
      };
    default:
      return state;
  }
};
