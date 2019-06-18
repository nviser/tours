import {
  SET_WINDOW_SIZE,
  SET_WINDOW_ORIENTATION,
  SET_IS_MOBILE,
  SET_ONLINE,
  SET_SCROLL,
} from './types';

export const setWindowSize = (width, height) => dispatch => {
  dispatch({ type: SET_WINDOW_SIZE, payload: [width, height] });
  dispatch({ type: SET_IS_MOBILE, payload: width < 960 });
};

export const setWindowOrientation = orientation => dispatch =>
  dispatch({ type: SET_WINDOW_ORIENTATION, payload: orientation });

export const setOnline = online => dispatch =>
  dispatch({ type: SET_ONLINE, payload: online });

export const setScroll = payload => dispatch =>
  dispatch({ type: SET_SCROLL, payload });
