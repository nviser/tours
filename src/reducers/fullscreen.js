import { SET_FULL_SCREEN } from '../actions/types';

const initialState = {
  fullScreen: false,
};

export default (state = initialState, action = []) => {
  switch (action.type) {
    case SET_FULL_SCREEN:
      return {
        ...state,
        fullScreen: action.value,
      };
    default:
      return state;
  }
};
