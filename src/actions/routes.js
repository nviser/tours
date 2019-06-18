import {
  SELECT_ROUTES,
  SELECT_SINGLE_ROUTE,
  SET_ROUTE_TITLE,
  SET_ROUTES,
  SET_EDIT_ROUTE_ID,
  SET_TOUR_EDITABLE,
  SET_CATEGORIES,
  SET_CATEGORY_COLOR,
  SET_STATUS,
} from './types';

export const selectRoutes = payload => dispatch =>
  dispatch({
    type: SELECT_ROUTES,
    payload,
  });

export const selectSingleRoute = payload => dispatch =>
  dispatch({
    type: SELECT_SINGLE_ROUTE,
    payload,
  });

export const setRouteTitle = payload => dispatch =>
  dispatch({
    type: SET_ROUTE_TITLE,
    payload,
  });

export const setRoutes = payload => dispatch =>
  dispatch({
    type: SET_ROUTES,
    payload,
  });

export const setEditedRouteId = payload => dispatch =>
  dispatch({
    type: SET_EDIT_ROUTE_ID,
    payload,
  });

export const setTourEditable = payload => ({
  type: SET_TOUR_EDITABLE,
  payload,
});

export const setCategories = payload => ({
  type: SET_CATEGORIES,
  payload,
});

export const setCategoryColor = payload => ({
  type: SET_CATEGORY_COLOR,
  payload,
});

export const setStatus = payload => ({
  type: SET_STATUS,
  payload,
});
